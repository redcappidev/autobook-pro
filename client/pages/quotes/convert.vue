<template>
  <div class="autobookpro-page-content">
    <div class="row items-start q-mb-lg">
      <div class="text-h5">
        <q-icon name="card_travel" />
        <span v-if="isQuoteContext">Order ID:</span>
        <span v-if="isOrderContext">Quote ID:</span>
        <span class="text-bold"> #{{ id }}</span>
      </div>
      <div class="col-grow row justify-end">
        <q-btn
          outline
          color="primary"
          label="Book Order"
          @click="handleConvert"
          :loading="converting"
        />
      </div>
    </div>
    <q-separator class="q-my-sm" />

    <div class="q-mb-md row justify-between">
      <div class="row q-gutter-x-sm">
        <q-select
          style="width: 250px;"
          dense
          use-input
          label="Status"
          v-model="parentStatus"
          :options="parentStatusOptions"
          option-label="name"
          option-value="id"
          :loading="loadingParentStatus"
          @filter="filterParentStatusFn"
          @input="dirty.parentStatus = true"
        />
        <q-select
          style="min-width: 250px;"
          class="q-mx-sm"
          dense
          use-input
          label="Child Status"
          v-model="childStatus"
          :options="childStatusOptions"
          option-label="name"
          option-value="id"
          :loading="loadingChildStatus"
          @filter="filterChildStatusFn"
          @input="dirty.childStatus = true"
        />
      </div>
      <div class="row q-gutter-x-sm">
        <q-select
          dense
          style="min-width: 250px;"
          v-model="referrer"
          label="Referrer"
          option-value="value"
          option-label="label"
          :options="referrers"
          @input="dirty.referrer = true"
        />
        <q-select
          dense
          style="min-width: 250px;"
          v-model="assignee"
          label="Assignee"
          :options="users"
          option-value="id"
          :option-label="(item) => `${item.firstName} ${item.lastName}`"
          @input="dirty.assignee = true"
        />
      </div>
    </div>
    <div class="row q-col-gutter-sm">
      <div class="col-md-8 col-sm-12 q-col-gutter-y-sm">
        <div class="row q-col-gutter-sm">
          <div :class="`${isOrderContext ? 'col-12' : 'col'}`">
            <app-customer-info-card
              :context="`${isQuoteContext ? 'order' : 'quote'}`"
              action="edit"
              v-model="shipper"
              @input="dirty.shipper = true"
              :validation="$v.shipper"
            />
          </div>
        </div>
        <div class="row q-col-gutter-sm">
          <div class="col">
            <app-location-filterable-card
              :context="`${isQuoteContext ? 'order' : 'quote'}`"
              action="edit"
              label="Origin"
              v-model="origin"
              @input="handleLocationChange('origin')"
              :validation="$v.origin"
            />
          </div>
          <div class="col">
            <app-location-filterable-card
              :context="`${isQuoteContext ? 'order' : 'quote'}`"
              action="edit"
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
              :context="`${isQuoteContext ? 'order' : 'quote'}`"
              action="edit"
              v-model="vehicles"
              @input="dirty.vehicles = true"
              :validation="$v.vehicles"
            />
          </div>
        </div>

        <!-- <div class="q-ma-sm">
          <app-google-map-view-location
            :type="['edit', 'quote']"
            :origin="origin"
            :destination="destination"
          />
        </div> -->
      </div>
      <div class="col-md-4 col-sm-12 q-col-gutter-y-sm">
        <div>
          <app-transport-pricing-card
            :context="`${isQuoteContext ? 'order' : 'quote'}`"
            action="edit"
            v-model="transport"
            @run-taq="handleRunTAQ"
            :running-taq="runningTAQ"
            @input="dirty.transport = true"
            :validation="$v.transport"
          />
        </div>
        <div>
          <app-transport-info-card
            ref="transportInfoCardRef"
            :context="`${isQuoteContext ? 'order' : 'quote'}`"
            action="edit"
            v-model="transport"
            @input="dirty.transport = true"
            :validation="$v.transport"
          />
        </div>

        <div>
          <app-internal-notes-card
            context="quote"
            action="edit"
            title="Notes"
            v-model="internalNotes"
            @input="dirty.internalNote = true"
          />
        </div>

        <!-- <div>
          <app-doc-image-uploader-card :data="quote.id" />
        </div> -->
      </div>
    </div>
  </div>
</template>
<script>
import { orderValidator, quoteValidator } from '@client/validators';
import graphql from '@client/graphql';
import {
  extractKeysIntoObject,
  sanitizeObject
} from '@client/utils/object-helpers';
import { referrers } from '@server/constants/referrers';
import AppCustomerInfoCard from '@client/components/cards/customer-info-card';
import AppLocationFilterableCard from '@client/components/cards/location-filterable-card';
import AppVehicleDetailsCard from '@client/components/cards/vehicle-details-card';
import AppTransportInfoCard from '@client/components/cards/transport-info-card';
import AppTransportPricingCard from '@client/components/cards/transport-pricing-card';
import AppInternalNotesCard from '@client/components/cards/internal-notes-card';
// import AppGoogleMapViewLocation from '@client/components/cards/google-map-view-location';
// import AppDocImageUploaderCard from '@client/components/cards/doc-image-uploader-card';

export default {
  name: 'AppConvertToOrder',
  metaInfo() {
    let title = 'Convert to Order';
    if (this.isOrderContext) title = 'Convert to quote';

    return { title };
  },
  graphql,
  components: {
    AppCustomerInfoCard,
    AppLocationFilterableCard,
    AppVehicleDetailsCard,
    AppTransportInfoCard,
    AppTransportPricingCard,
    AppInternalNotesCard
    // AppGoogleMapViewLocation,
    // AppDocImageUploaderCard,
  },
  validations() {
    if (this.isOrderContext) return quoteValidator;
    return orderValidator;
  },
  apollo: {
    quote() {
      let gql = graphql.queries.getQuote;
      if (this.isOrderContext) gql = graphql.queries.getOrder;

      return {
        query: gql,
        variables() {
          return { id: this.theQuoteId };
        },
        watchLoading(isLoading) {
          this.loading = isLoading;
        },
        error(error) {
          this.error = error;
        },
        update(data) {
          if (this.isQuoteContext) return data.quote;
          return data.order;
        },
        result(result) {
          if (result.loading) return;

          let theQuote = result.data.quote;
          if (this.isOrderContext) theQuote = result.data.order;
          Object.assign(this, theQuote);

          this.origin.phone = this.origin.phone || '';
          this.destination.phone = this.destination.phone || '';
        }
      };
    },
    parentStatuses: {
      query: graphql.queries.getParentStatus,
      variables() {
        if (this.isOrderContext) return { type: 'QUOTE' };
        return { type: 'ORDER' };
      },
      watchLoading(isLoading) {
        this.loadingParentStatus = isLoading;
      }
    },
    users: {
      query: graphql.queries.loadUsers
    }
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
      loading: false,
      error: null,
      id: null,

      parent: null,

      referrer: referrers[0],
      referrers,

      assignee: null,

      loadingParentStatus: false,
      parentStatus: null,
      parentStatusOptions: [],

      loadingChildStatus: false,
      childStatus: null,
      childStatusOptions: [],

      shipper: {},
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
          size: {
            id: null,
            name: ''
          }
        }
      ],

      runningTAQ: false,
      transport: {},

      internalNotes: [],

      converting: false,

      dirty: {}
    };
  },
  computed: {
    theQuoteId() {
      return this.$route.params.id;
    },
    isQuoteContext() {
      return this.$route.name === 'convert-to-order';
    },
    isOrderContext() {
      return this.$route.name === 'convert-to-quote';
    }
  },
  methods: {
    handleLocationChange(key) {
      this.$set(this.dirty, key, true);

      if (!this.origin.zipcode || !this.destination.zipcode) return;

      if (this.quote.origin.zipcode !== this.origin.zipcode) {
        this.$refs.transportInfoCardRef.calcDistance(
          this.origin,
          this.destination
        );
      } else if (this.quote.destination.zipcode !== this.destination.zipcode) {
        this.$refs.transportInfoCardRef.calcDistance(
          this.origin,
          this.destination
        );
      }
    },
    filterParentStatusFn(val, update) {
      update(() => {
        const needle = val.toLowerCase();
        this.parentStatusOptions = this.parentStatuses.filter(
          (v) => v.name.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    filterChildStatusFn(val, update) {
      update(() => {
        const needle = val.toLowerCase();
        this.childStatusOptions = this.parentStatuses
          .find((s) => s.id === this.parentStatus.id)
          .children.filter((v) => v.name.toLowerCase().indexOf(needle) > -1);
      });
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
    async convertToOrder() {
      const inputData = extractKeysIntoObject(this, [
        'assignee',
        'referrer',
        'parentStatus',
        'childStatus',
        'shipper',
        'origin',
        'destination',
        'vehicles',
        'transport',
        'internalNotes'
      ]);

      const input = {
        assigneeId: parseInt(inputData.assignee.id, 10),
        referrer: inputData.referrer ? inputData.referrer.value : null,
        parentStatusId: inputData.parentStatus
          ? parseInt(inputData.parentStatus.id, 10)
          : null,
        childStatusId: inputData.childStatus
          ? parseInt(inputData.childStatus.id, 10)
          : null,
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
        internalNotes: inputData.internalNotes.map((n) => sanitizeObject(n))
      };

      await this.$apollo.mutate({
        mutation: graphql.mutations.convertToOrder,
        variables: {
          quoteId: this.theQuoteId,
          input
        }
      });
    },
    async convertToQuote() {
      const inputData = extractKeysIntoObject(this, [
        'assignee',
        'referrer',
        'parentStatus',
        'childStatus',
        'shipper',
        'origin',
        'destination',
        'vehicles',
        'transport',
        'internalNotes'
      ]);

      const input = {
        assigneeId: parseInt(inputData.assignee.id, 10),
        referrer: inputData.referrer ? inputData.referrer.value : null,
        parentStatusId: inputData.parentStatus
          ? parseInt(inputData.parentStatus.id, 10)
          : null,
        childStatusId: inputData.childStatus
          ? parseInt(inputData.childStatus.id, 10)
          : null,
        shipper: extractKeysIntoObject(sanitizeObject(inputData.shipper), [
          'firstName',
          'lastName',
          'phone',
          'phone2',
          'email',
          'noText',
          'noEmail'
        ]),
        origin: extractKeysIntoObject(sanitizeObject(inputData.origin), [
          'name',
          'address',
          'zipcode',
          'city',
          'state',
          'phone',
          'phone2'
        ]),
        destination: extractKeysIntoObject(
          sanitizeObject(inputData.destination),
          ['name', 'address', 'zipcode', 'city', 'state', 'phone', 'phone2']
        ),
        transport: sanitizeObject(inputData.transport),
        vehicles: inputData.vehicles.map((v) =>
          extractKeysIntoObject(sanitizeObject(v), [
            'year',
            'make',
            'model',
            'operable'
          ])
        ),
        internalNotes: inputData.internalNotes.map((n) => sanitizeObject(n))
      };

      await this.$apollo.mutate({
        mutation: graphql.mutations.convertToQuote,
        variables: {
          orderId: this.theQuoteId,
          input
        }
      });
    },
    async handleConvert() {
      this.validate([
        'shipper',
        'origin',
        'destination',
        'transport',
        'vehicles'
      ]);

      this.converting = true;

      if (this.isQuoteContext) {
        await this.convertToOrder();
      } else {
        await this.convertToQuote();
      }

      this.converting = false;
      this.dirty = {};

      if (this.isQuoteContext) {
        this.$router.push({
          name: 'order-detail',
          params: { id: this.id },
          query: { edit: 'true' }
        });
      } else {
        this.$router.push({
          name: 'quote-detail',
          params: { id: this.id },
          query: { edit: 'true' }
        });
      }
    }
  }
};
</script>
