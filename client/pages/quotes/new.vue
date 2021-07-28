<template>
  <div class="autobookpro-page-content">
    <div class="row items-start q-mb-lg">
      <div class="text-h5 row items-center">
        <span v-if="isQuoteContext">New Quote</span>
        <span v-if="isOrderContext">New Order</span>
        <q-btn
          v-for="(QUOTE_ENGAGEMENT, index) in QUOTE_ENGAGEMENTS.filter(
            (qe) => qe.position === 'quote_header' && !qe.automatic
          )"
          v-bind:key="`nonautomatic-${index}`"
          size="md"
          flat
          :color="`${
            engagements.includes(QUOTE_ENGAGEMENT.value) ? 'negative' : ''
          }`"
          :icon="QUOTE_ENGAGEMENT.icon"
          round
          @click="handleSetEngagement(QUOTE_ENGAGEMENT.value)"
        />
      </div>
      <div class="col-grow row justify-end">
        <q-btn
          outline
          color="primary"
          label="Save"
          :loading="savingQuote"
          @click="handleSaveQuote"
        />
      </div>
    </div>

    <q-separator class="q-my-sm" />

    <div class="q-mb-md row q-gutter-x-sm">
      <app-select-input
        v-model="referrer"
        :options="referrers"
        label="Referrer"
        option-value="value"
        option-label="label"
        style="min-width: 300px;"
        @input="dirty.referrer = true"
      />
      <app-select-input
        v-model="assignee"
        :options="users"
        label="Assignee"
        option-value="id"
        :option-label="(item) => `${item.firstName} ${item.lastName}`"
        style="min-width: 300px;"
        @input="dirty.assignee = true"
      />
    </div>

    <div class="q-mb-md row q-gutter-x-sm">
      <q-btn
        v-for="(QUOTE_ENGAGEMENT, index) in QUOTE_ENGAGEMENTS.filter(
          (qe) => qe.manualPress
        )"
        v-bind:key="index"
        size="md"
        flat
        :color="`${
          engagements.includes(QUOTE_ENGAGEMENT.value) ? 'negative' : ''
        }`"
        :icon="QUOTE_ENGAGEMENT.icon"
        round
        @click="handleSetEngagement(QUOTE_ENGAGEMENT.value)"
      />
    </div>

    <div class="row q-col-gutter-sm">
      <div class="col-md-8 col-sm-12 q-col-gutter-y-sm">
        <div class="row q-col-gutter-sm">
          <div :class="`${isQuoteContext ? 'col' : 'col-12'}`">
            <app-customer-info-card
              :context="`${isQuoteContext ? 'quote' : 'order'}`"
              action="create"
              v-model="shipper"
              @input="dirty.shipper = true"
              :validation="$v.shipper"
            >
              <template #header>
                <q-btn
                  v-for="(QUOTE_ENGAGEMENT, index) in QUOTE_ENGAGEMENTS.filter(
                    (qe) => qe.position === 'customer_header' && !qe.automatic
                  )"
                  v-bind:key="`nonautomatic-${index}`"
                  size="md"
                  flat
                  :color="`${
                    engagements.includes(QUOTE_ENGAGEMENT.value)
                      ? 'negative'
                      : ''
                  }`"
                  :icon="QUOTE_ENGAGEMENT.icon"
                  round
                  @click="handleSetEngagement(QUOTE_ENGAGEMENT.value)"
                />
              </template>
            </app-customer-info-card>
          </div>
          <div class="col" v-if="isQuoteContext">
            <app-follow-up-card
              context="quote"
              action="create"
              v-model="followups"
              @input="dirty.followup = true"
            />
          </div>
        </div>

        <div class="row q-col-gutter-sm">
          <div class="col">
            <app-location-filterable-card
              :context="`${isQuoteContext ? 'quote' : 'order'}`"
              action="create"
              label="Origin"
              v-model="origin"
              @input="handleLocationChange('origin')"
              :validation="$v.origin"
            />
          </div>
          <div class="col">
            <app-location-filterable-card
              :context="`${isQuoteContext ? 'quote' : 'order'}`"
              action="create"
              label="Destination"
              v-model="destination"
              @input="handleLocationChange('destination')"
              :validation="$v.destination"
            />
          </div>
        </div>

        <div class="row">
          <div class="col-12">
            <app-vehicle-details-card
              :context="`${isQuoteContext ? 'quote' : 'order'}`"
              action="create"
              v-model="vehicles"
              @input="dirty.vehicles = true"
              :validation="$v.vehicles"
            />
          </div>
        </div>
      </div>

      <div class="col-md-4 col-sm-12 q-col-gutter-y-sm">
        <div>
          <app-transport-pricing-card
            :context="`${isQuoteContext ? 'quote' : 'order'}`"
            action="create"
            v-model="transport"
            @input="dirty.transport = true"
            @run-taq="handleRunTAQ"
            :running-taq="runningTAQ"
            :validation="$v.transport"
          />
        </div>
        <div>
          <app-transport-info-card
            ref="transportInfoCardRef"
            :context="`${isQuoteContext ? 'quote' : 'order'}`"
            action="create"
            v-model="transport"
            @input="dirty.transport = true"
            :validation="$v.transport"
          />
        </div>
        <div>
          <app-internal-notes-card
            :context="`${isQuoteContext ? 'quote' : 'order'}`"
            action="create"
            title="Notes"
            v-model="internalNotes"
            @input="dirty.internalNotes = true"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { formatISO } from 'date-fns';
import { assessPermission } from '@server/lib/permission-helpers';
import { DATE_RANGE, QUOTE_ENGAGEMENTS } from '@server/constants';
import { quoteValidator, orderValidator } from '@client/validators';
import delayTouch from '@client/utils/delay-touch';
import {
  extractKeysIntoObject,
  sanitizeObject
} from '@client/utils/object-helpers';
import graphql from '@client/graphql';
import { referrers } from '@server/constants/referrers';
import AppCustomerInfoCard from '@client/components/cards/customer-info-card';
import AppLocationFilterableCard from '@client/components/cards/location-filterable-card';
import AppVehicleDetailsCard from '@client/components/cards/vehicle-details-card';
import AppTransportInfoCard from '@client/components/cards/transport-info-card';
import AppTransportPricingCard from '@client/components/cards/transport-pricing-card';
import AppFollowUpCard from '@client/components/cards/follow-up-card';
import AppSelectInput from '@client/components/form/select-input';
import AppInternalNotesCard from '@client/components/cards/internal-notes-card';

export default {
  name: 'AppCreateQuote',
  metaInfo() {
    let title = 'New Quote';
    if (this.isOrderContext) title = 'New Order';
    return { title };
  },
  components: {
    AppCustomerInfoCard,
    AppLocationFilterableCard,
    AppVehicleDetailsCard,
    AppTransportInfoCard,
    AppTransportPricingCard,
    AppFollowUpCard,
    AppSelectInput,
    AppInternalNotesCard
  },
  apollo: {
    currentUser: {
      query: graphql.queries.currentUser,
      result(queryResult) {
        this.assignee = queryResult.data.currentUser;
      }
    },
    users: {
      query: graphql.queries.loadUsers
    }
  },
  validations() {
    if (this.isQuoteContext) return quoteValidator;
    return orderValidator;
  },
  beforeMount() {
    const preventNav = (event) => {
      if (Object.keys(this.dirty).length > 0) {
        event.preventDefault();
        // eslint-disable-next-line no-param-reassign
        event.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', preventNav);
    this.$once('hook:beforeDestroy', () => {
      window.removeEventListener('beforeunload', preventNav);
    });
  },
  beforeRouteLeave(to, from, next) {
    if (Object.keys(this.dirty).length > 0) {
      this.$q
        .dialog({
          title: 'Confirm',
          message:
            'Changes you made may not be saved. Are you sure you want to leave?',
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          next();
        })
        .onCancel(() => {
          next(false);
        });
    } else {
      next();
    }
  },
  data() {
    return {
      savingQuote: false,
      runningTAQ: false,

      engagements: [],
      QUOTE_ENGAGEMENTS,

      referrer: referrers[0],
      referrers,

      assignee: null,

      shipper: {
        phone: '',
        noText: false,
        noEmail: false
      },
      origin: {
        phone: ''
      },
      destination: {
        phone: ''
      },
      vehicles: [
        {
          year: null,
          make: null,
          model: null,
          operable: null,
          size: {
            id: null,
            name: ''
          }
        }
      ],
      transport: {
        carrierType: 'OPEN',
        availableDate: formatISO(new Date(), { representation: 'date' }),
        deliveryDate: null,
        deposit: 0,
        totalPrice: 0,
        basePrice: 0,
        sizeFee: 0,
        inopFee: 0,
        enclosedFee: 0,
        fullPay: 0
      },
      internalNotes: [],
      followups: [],

      prevOriginZipcode: null,
      prevDestZipcode: null,

      dirty: {}
    };
  },
  computed: {
    isQuoteContext() {
      return this.$route.name === 'create-quote';
    },
    isOrderContext() {
      return this.$route.name === 'create-order';
    }
  },
  watch: {
    $route(to) {
      if (to.query.referrer === 'quick-quote') {
        this.continueQuickQuote();
      }
    }
  },
  mounted() {
    if (this.$route.query.referrer === 'quick-quote') {
      this.continueQuickQuote();
    }
  },
  methods: {
    handleSetEngagement(engagement) {
      if (this.engagements.includes(engagement)) {
        this.engagements = this.engagements.filter((e) => e !== engagement);
      } else {
        this.engagements = this.engagements.concat(engagement);
      }
    },
    continueQuickQuote() {
      const quickQuote = localStorage.getItem('quick-quote');

      if (quickQuote) {
        Object.assign(this, JSON.parse(quickQuote));

        this.$nextTick(() => {
          this.$refs.transportInfoCardRef.calcDistance(
            this.origin,
            this.destination
          );
        });
      }
    },
    handleLocationChange(key) {
      this.dirty[key] = true;

      if (!this.origin.zipcode || !this.destination.zipcode) return;

      if (!this.prevOriginZipcode && !this.prevDestZipcode) {
        this.$refs.transportInfoCardRef.calcDistance(
          this.origin,
          this.destination
        );
      } else if (
        this.prevOriginZipcode !== this.origin.zipcode ||
        this.prevDestZipcode !== this.destination.zipcode
      ) {
        this.$refs.transportInfoCardRef.calcDistance(
          this.origin,
          this.destination
        );
      }

      this.prevOriginZipcode = this.origin.zipcode;
      this.prevDestZipcode = this.destination.zipcode;
    },
    async createQuote() {
      try {
        const inputData = extractKeysIntoObject(this, [
          'engagements',
          'assignee',
          'referrer',
          'shipper',
          'origin',
          'destination',
          'vehicles',
          'transport',
          'internalNotes',
          'followups'
        ]);
        const res = await this.$apollo.mutate({
          mutation: graphql.mutations.createQuote,
          variables: {
            input: {
              shipper: sanitizeObject(inputData.shipper),
              origin: sanitizeObject(inputData.origin),
              destination: sanitizeObject(inputData.destination),
              transport: sanitizeObject(inputData.transport),
              vehicles: inputData.vehicles.map(
                ({ size, ...vehicle }) => vehicle
              ),
              assigneeId: parseInt(inputData.assignee.id, 10),
              referrer: inputData.referrer ? inputData.referrer.value : null,
              internalNotes: inputData.internalNotes,
              followups: inputData.followups,
              engagements: inputData.engagements
            }
          },
          update: (store, { data: { createQuote } }) => {
            const variables = {
              cursor: { page: 0, size: 10 },
              filterBy: {
                search: null,
                timezone: null,
                parentStatusId: null,
                childStatusId: null,
                assigneeId: this.currentUser.id,
                group: DATE_RANGE.today,
                engagements: null
              },
              sortBy: 'ID_ASC'
            };
            const data = store.readQuery({
              query: graphql.queries.loadQuotes,
              variables
            });
            data.quotes.data = [...data.quotes.data, createQuote];
            store.writeQuery({
              query: graphql.queries.loadQuotes,
              variables,
              data
            });
          }
        });

        this.notifyPositive('A quote has been successfully created!');

        this.$router.push({
          name: 'quote-detail',
          params: { id: res.data.createQuote.id },
          query: assessPermission.quote.canUpdate(this.currentUser)
            ? { edit: 'true' }
            : {}
        });
      } catch (error) {
        this.notifyNegative(error.message);
      }
    },
    async createOrder() {
      try {
        const inputData = extractKeysIntoObject(this, [
          'engagements',
          'assignee',
          'referrer',
          'shipper',
          'origin',
          'destination',
          'vehicles',
          'transport',
          'internalNotes'
        ]);

        const res = await this.$apollo.mutate({
          mutation: graphql.mutations.createOrder,
          variables: {
            input: {
              engagements: inputData.engagements,
              assigneeId: parseInt(inputData.assignee.id, 10),
              referrer: inputData.referrer ? inputData.referrer.value : null,
              shipper: sanitizeObject(inputData.shipper),
              origin: sanitizeObject(inputData.origin),
              destination: sanitizeObject(inputData.destination),
              transport: sanitizeObject(inputData.transport),
              vehicles: inputData.vehicles
                .map((v) => sanitizeObject(v))
                .map(({ size, ...v }) => {
                  if (size) return { ...v, sizeId: size.id };
                  return v;
                }),
              internalNotes: this.internalNotes.map((n) => sanitizeObject(n))
            }
          },
          update: (store, { data: { createQuote } }) => {
            const variables = {
              cursor: { page: 0, size: 10 },
              filterBy: {
                search: null,
                timezone: null,
                parentStatusId: null,
                childStatusId: null,
                assigneeId: this.currentUser.id,
                group: DATE_RANGE.today,
                engagements: null
              },
              sortBy: 'ID_ASC'
            };
            const data = store.readQuery({
              query: graphql.queries.loadOrders,
              variables
            });
            data.orders.data = [...data.orders.data, createQuote];
            store.writeQuery({
              query: graphql.queries.loadOrders,
              variables,
              data
            });
          }
        });

        this.notifyPositive('An order has been successfully created!');

        this.$router.push({
          name: 'order-detail',
          params: { id: res.data.createOrder.id },
          query: assessPermission.order.canUpdate(this.currentUser)
            ? { edit: 'true' }
            : {}
        });
      } catch (error) {
        this.notifyNegative(error.message);
      }
    },
    async handleSaveQuote() {
      this.validate([
        'shipper',
        'origin',
        'destination',
        'transport',
        'vehicles'
      ]);

      this.savingQuote = true;

      if (this.isQuoteContext) {
        await this.createQuote();
      } else {
        await this.createOrder();
      }

      this.savingQuote = false;
    },
    async handleRunTAQ() {
      this.validate(['origin', 'destination', 'vehicles']);

      this.runningTAQ = true;

      try {
        const response = await this.$apollo.mutate({
          mutation: graphql.mutations.calcQuotePrice,
          variables: {
            origin: this.origin,
            destination: this.destination,
            vehicles: this.vehicles,
            carrierType: this.transport.carrierType,
            referrer: this.referrer ? this.referrer.value : null
          }
        });
        const { calcQuotePrice } = response.data;
        this.transport = {
          ...this.transport,
          ...calcQuotePrice
        };
      } catch (error) {
        this.notifyNegative(error.message);
      }

      this.runningTAQ = false;
    },
    delayTouch
  }
};
</script>
<style lang="scss"></style>
