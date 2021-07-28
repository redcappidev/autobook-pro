<template>
  <div class="autobookpro-page-content">
    <div class="row items-start q-mb-lg">
      <div class="col-lg-3 col-md-4 col-sm-12">
        <div class="text-h5 row items-center">
          <template v-if="!quoteId">
            <q-icon name="card_travel" />
            <span class="q-ml-sm" v-if="isQuoteContext">Quote ID:&nbsp;</span>
            <span class="q-ml-sm" v-if="isOrderContext">Order ID:&nbsp;</span>
            <span class="text-bold"> #{{ id }}</span>
          </template>
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
            :disable="!canUpdateQuote || loading"
            :loading="saving.engagements[QUOTE_ENGAGEMENT.value]"
          />
          <q-icon
            class="q-px-sm text-primary"
            v-for="(QUOTE_ENGAGEMENT, index) in QUOTE_ENGAGEMENTS.filter(
              (qe) =>
                qe.position === 'quote_header' &&
                qe.automatic &&
                engagements.includes(qe.value)
            )"
            v-bind:key="`automatic-${index}`"
            :name="QUOTE_ENGAGEMENT.icon"
          />
        </div>
        <div>
          <div v-if="parent">
            <span>Parent Quote</span>
            <a
              class="text-bold text-primary"
              :href="`/quotes/${parent.id}`"
              target="_blank"
              v-if="parent && !parent.isOrder"
            >
              #{{ parent.id }}
            </a>
            <a
              class="text-bold text-primary"
              :href="`/orders/${parent.id}`"
              target="_blank"
              v-if="parent && parent.isOrder"
            >
              #{{ parent.id }}
            </a>
          </div>
          <div v-if="quote && quote.children.length > 0">
            <span>Children</span>
            <a
              class="text-bold text-primary"
              :href="`/${child.isOrder ? 'orders' : 'quotes'}/${child.id}`"
              target="_blank"
              v-for="child in quote.children"
              v-bind:key="child.id"
            >
              #{{ child.id }}
            </a>
          </div>
        </div>
      </div>
      <div class="col-lg-9 col-md-8 col-sm-12 row justify-end q-gutter-sm">
        <q-btn
          v-if="
            this.isOrderContext &&
            canDispatch &&
            quote &&
            (!quote.parentStatus ||
              quote.parentStatus.id !== DISPATCHED_STATUS_ID)
          "
          outline
          color="primary"
          label="Dispatch"
          @click="$refs.dispatchToCarrierDialogRef.openDialog()"
          :disable="loading"
        />
        <q-btn
          outline
          color="orange"
          label="Find Similar Loads on Central Dispatch"
          type="a"
          :href="`https://www.centraldispatch.com/protected/listing-search/result?pickupCitySearch=1&pickupRadius=50&pickupCity=${origin.city}&pickupState=${origin.state}&pickupZip=${origin.zipcode}&origination_valid=1&deliveryCitySearch=1&deliveryRadius=50&deliveryCity=${destination.city}&deliveryState=${destination.state}&deliveryZip=${destination.zipcode}&destination_valid=1&trailerType=&vehiclesRun=&minVehicles=1&maxVehicles=&shipWithin=60&paymentType=&minPayPrice=&minPayPerMile=&highlightPeriod=0&listingsPerPage=100&postedBy=&primarySort=1&secondarySort=4`"
          target="_blank"
          :disable="loading"
        />
        <q-btn-dropdown
          v-if="canContactShipper"
          outline
          color="primary"
          label="Contact Shipper"
          :disable="loading"
        >
          <q-list>
            <q-item clickable>
              <q-item-section>Send Email</q-item-section>
              <q-item-section side>
                <q-icon name="keyboard_arrow_right" />
              </q-item-section>
              <q-menu anchor="top right" self="top left">
                <q-list>
                  <q-item
                    clickable
                    v-for="template in emailTemplates"
                    :key="template.id"
                    v-close-popup
                    @click="handleSendEmail(template)"
                    :disable="!shipper.email"
                  >
                    <q-item-section>{{ template.name }}</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-item>
            <q-item clickable>
              <q-item-section>Send SMS</q-item-section>
              <q-item-section side>
                <q-icon name="keyboard_arrow_right" />
              </q-item-section>
              <q-menu anchor="top right" self="top left">
                <q-list>
                  <q-item
                    clickable
                    v-for="template in smsTemplates"
                    :key="template.id"
                    v-close-popup
                    @click="handleSendSMS(template)"
                  >
                    <q-item-section>{{ template.name }}</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-item>
            <q-item
              clickable
              v-close-popup
              @click="handleSendTosEmail"
              v-if="isOrderContext"
            >
              <q-item-section>Email Terms & Conditions</q-item-section>
            </q-item>
            <q-item
              clickable
              v-close-popup
              @click="handleSendBillingInfoEmail"
              v-if="isOrderContext"
            >
              <q-item-section>Email Billing Info Input</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-btn-dropdown
          v-if="canCreateQuote"
          outline
          color="primary"
          label="Copy"
          :loading="duplicating"
          :disable="loading"
        >
          <q-list>
            <q-item
              clickable
              v-close-popup
              @click="handleDuplicate('STANDARD')"
            >
              <q-item-section>
                <q-item-label>Standard</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="handleDuplicate('REVERSE')">
              <q-item-section>
                <q-item-label>Reverse</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-btn
          v-if="canBookOrder"
          outline
          color="secondary"
          label="Book Order"
          @click="handleConvert(true)"
          :disable="loading"
        />
        <q-btn
          v-if="canConvertToQuote"
          outline
          color="secondary"
          label="Convert to Quote"
          @click="handleConvert(false)"
          :disable="loading"
        />
        <q-btn
          v-if="isEditingQuote && canUpdateQuote"
          outline
          color="secondary"
          label="Update"
          @click="handleUpdate"
          :loading="loadingSave"
          :disable="loading"
        />
      </div>
    </div>

    <q-separator class="q-my-sm" v-if="!quoteId" />

    <div class="q-mb-md row justify-between">
      <div class="row q-gutter-x-sm">
        <app-select-input
          :loadingData="loading"
          :readonly="!canUpdateQuote && !canNotUpdateButPostToLoadBoardOnly"
          style="width: 250px;"
          use-input
          clearable
          label="Status"
          v-model="parentStatus"
          :options="parentStatusOptions"
          option-label="name"
          option-value="id"
          :loading="loadingParentStatus"
          @filter="filterParentStatusFn"
          @input="handleParentStatusChange"
        />
        <app-select-input
          :loadingData="loading"
          :readonly="!canUpdateQuote"
          style="min-width: 250px;"
          class="q-mx-sm"
          use-input
          clearable
          label="Child Status"
          v-model="childStatus"
          :options="childStatusOptions"
          option-label="name"
          option-value="id"
          :loading="loadingChildStatus"
          @filter="filterChildStatusFn"
          @input="handleChildStatusChange"
        />
      </div>
      <div class="row q-gutter-x-sm">
        <app-select-input
          :loadingData="loading"
          :readonly="!canUpdateQuote"
          style="min-width: 250px;"
          v-model="referrer"
          label="Referrer"
          option-value="value"
          option-label="label"
          :options="referrers"
          :loading="saving.referrer"
          :disable="saving.referrer"
          @input="handleUpdateReferrer"
        />
        <app-select-input
          :loadingData="loading"
          :readonly="!canUpdateQuote"
          style="min-width: 250px;"
          v-model="assignee"
          label="Assignee"
          :options="users"
          option-value="id"
          :option-label="(item) => `${item.firstName} ${item.lastName}`"
          :loading="saving.assignee"
          :disable="saving.assignee"
          @input="handleUpdateAssignee"
        />
      </div>
    </div>

    <div class="q-mb-md row q-col-gutter-sm">
      <div class="col-md-8 col-sm-12 q-col-gutter-y-sm">
        <div class="row q-col-gutter-sm">
          <div :class="`${isOrderContext ? 'col-12' : 'col'}`">
            <app-customer-info-card
              :loadingData="loading"
              :possibleDuplicates="possibleDuplicates"
              :context="`${isQuoteContext ? 'quote' : 'order'}`"
              :readonly="!canUpdateQuote"
              :action="isEditingQuote ? 'edit' : 'view'"
              v-model="shipper"
              :saving="saving.shipper"
              :validation="$v.shipper"
              @input="dirty.shipper = true"
              @update="handleCustomerInfoUpdate"
            >
              <template #header>
                <q-btn
                  v-for="(QUOTE_ENGAGEMENT, index) in QUOTE_ENGAGEMENTS.filter(
                    (qe) => qe.position === 'customer_header' && !qe.automatic
                  )"
                  v-bind:key="`nonautomatic-${index}`"
                  size="sm"
                  flat
                  :color="`${
                    engagements.includes(QUOTE_ENGAGEMENT.value)
                      ? 'negative'
                      : ''
                  }`"
                  :icon="QUOTE_ENGAGEMENT.icon"
                  round
                  @click="handleSetEngagement(QUOTE_ENGAGEMENT.value)"
                  :disable="!canUpdateQuote || loading"
                  :loading="saving.engagements[QUOTE_ENGAGEMENT.value]"
                />
              </template>
            </app-customer-info-card>
          </div>
          <div class="col" v-if="isQuoteContext">
            <app-follow-up-card
              :loadingData="loading"
              :context="`${isQuoteContext ? 'quote' : 'order'}`"
              :readonly="!canUpdateQuote"
              :action="isEditingQuote ? 'edit' : 'view'"
              v-model="followups"
              :saving="saving.followups"
              @input="dirty.followups = true"
              @update="handleUpdateFollowup"
            />
          </div>
        </div>

        <div class="row q-col-gutter-sm">
          <div class="col">
            <app-location-filterable-card
              :loadingData="loading"
              :context="`${isQuoteContext ? 'quote' : 'order'}`"
              :readonly="!canUpdateQuote"
              :action="isEditingQuote ? 'edit' : 'view'"
              label="Origin"
              v-model="origin"
              :saving="saving.origin"
              :validation="$v.origin"
              @input="handleLocationChange('origin')"
              @update="handleLocationUpdate('origin', $event)"
            />
          </div>
          <div class="col">
            <app-location-filterable-card
              :loadingData="loading"
              :context="`${isQuoteContext ? 'quote' : 'order'}`"
              :readonly="!canUpdateQuote"
              :action="isEditingQuote ? 'edit' : 'view'"
              label="Destination"
              v-model="destination"
              :saving="saving.destination"
              :validation="$v.destination"
              @input="handleLocationChange('destination')"
              @update="handleLocationUpdate('destination', $event)"
            />
          </div>
        </div>

        <div class="row">
          <div class="col-12">
            <app-vehicle-details-card
              :loadingData="loading"
              :context="`${isQuoteContext ? 'quote' : 'order'}`"
              :readonly="!canUpdateQuote"
              :action="isEditingQuote ? 'edit' : 'view'"
              v-model="vehicles"
              :saving="saving.vehicles"
              :validation="$v.vehicles"
              @input="dirty.vehicles = true"
              @update="handleVehicleUpdate"
            />
          </div>
        </div>

        <div class="row">
          <div class="col-12">
            <app-google-map-card ref="googleMapCardRef" />
          </div>
        </div>
      </div>
      <div class="col-md-4 col-sm-12 q-col-gutter-y-sm">
        <div>
          <app-transport-pricing-card
            :loadingData="loading"
            :context="`${isQuoteContext ? 'quote' : 'order'}`"
            :readonly="!canUpdateQuote"
            :action="isEditingQuote ? 'edit' : 'view'"
            v-model="transport"
            :fullPayEnabled="
              quote &&
              (quote.engagements || []).includes(QUOTE_ENGAGEMENT_FULLPAY)
            "
            @run-taq="handleRunTAQ"
            :running-taq="runningTAQ"
            :saving="saving.transport"
            :validation="$v.transport"
            @input="dirty.transport = true"
            @update="handleUpdateTransportInformation($event)"
          >
            <template #header>
              <q-btn
                v-for="(QUOTE_ENGAGEMENT, index) in QUOTE_ENGAGEMENTS.filter(
                  (qe) => qe.position === 'pricing_header' && !qe.automatic
                )"
                v-bind:key="`nonautomatic-${index}`"
                size="sm"
                flat
                :color="`${
                  engagements.includes(QUOTE_ENGAGEMENT.value) ? 'negative' : ''
                }`"
                :icon="QUOTE_ENGAGEMENT.icon"
                round
                @click="handleSetEngagement(QUOTE_ENGAGEMENT.value)"
                :disable="!canUpdateQuote || loading"
                :loading="saving.engagements[QUOTE_ENGAGEMENT.value]"
              />
            </template>
          </app-transport-pricing-card>
        </div>
        <div>
          <app-transport-info-card
            ref="transportInfoCardRef"
            :loadingData="loading"
            :context="`${isQuoteContext ? 'quote' : 'order'}`"
            :readonly="!canUpdateQuote"
            :action="isEditingQuote ? 'edit' : 'view'"
            v-model="transport"
            :validation="$v.transport"
            :saving="saving.transport"
            @input="dirty.transport = true"
            @update="handleUpdateTransportInformation($event)"
          />
        </div>

        <div>
          <app-internal-notes-card
            :loadingData="loading"
            :context="`${isQuoteContext ? 'quote' : 'order'}`"
            :readonly="!canUpdateQuote"
            :action="isEditingQuote ? 'edit' : 'view'"
            title="Notes"
            v-model="internalNotes"
            :saving="saving.internalNote"
            @input="dirty.internalNote = true"
            @add="handleAddInternalNote"
            @delete="handleDeleteInternalNote"
            @update="handleUpdateInternalNote"
          />
        </div>

        <div v-if="isOrderContext">
          <app-payment-history-card
            :loadingData="loading"
            :shipper="shipper"
            :origin="origin"
            :destination="destination"
            :terms="terms"
            :transactions="transactions"
            :billingInfo="billingInfo"
            :saving="saving.billingInfo"
            :charging="saving.chargeCustomer"
            @on-change-billing-info="handleChangeBillingInfo"
            @on-charge-order="handleChargeCustomer"
          >
            <template #header>
              <q-icon
                v-if="engagements.includes(QUOTE_ENGAGEMENT_FULLPAY)"
                class="text-primary"
                :name="
                  QUOTE_ENGAGEMENTS.find(
                    (e) => e.value === QUOTE_ENGAGEMENT_FULLPAY
                  ).icon
                "
              />
            </template>
          </app-payment-history-card>
        </div>

        <div v-if="isOrderContext">
          <app-terms-and-condition-card
            :loadingData="loading"
            context="order"
            :value="terms"
          />
        </div>
        <!-- <div>
          <app-doc-image-uploader-card :data="quote.id" />
        </div> -->
      </div>
    </div>
    <q-card flat bordered>
      <q-card-section class="q-pa-sm bg-primary">
        <div class="text-subtitle1 text-bold q-px-sm">
          <q-icon
            name="history"
            style="font-size: 25px; padding-right: 0.1rem;"
          />
          History
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section v-if="!loading">
        <p v-for="event in quoteEvents" :key="event.id">
          {{ event.eventDate | localTime }} {{ event.description }}
        </p>
      </q-card-section>
      <q-card-section v-else>
        <div class="q-py-xs">
          <q-skeleton type="rect" animation="fade" />
        </div>
        <div class="q-py-xs">
          <q-skeleton type="rect" animation="fade" />
        </div>
        <div class="q-py-xs">
          <q-skeleton type="rect" animation="fade" />
        </div>
      </q-card-section>
    </q-card>
    <app-dispatch-to-carrier-dialog
      ref="dispatchToCarrierDialogRef"
      :orderId="this.theQuoteId"
    />
  </div>
</template>

<script>
import { quoteValidator, orderValidator } from '@client/validators';
import graphql from '@client/graphql';
import {
  extractKeysIntoObject,
  sanitizeObject
} from '@client/utils/object-helpers';
import { referrers } from '@server/constants/referrers';
import { QUOTE_ENGAGEMENTS, QUOTE_ENGAGEMENT_FULLPAY } from '@server/constants';
import { assessPermission } from '@server/lib/permission-helpers';
import AppCustomerInfoCard from '@client/components/cards/customer-info-card';
import AppLocationFilterableCard from '@client/components/cards/location-filterable-card';
import AppVehicleDetailsCard from '@client/components/cards/vehicle-details-card';
import AppTransportInfoCard from '@client/components/cards/transport-info-card';
import AppTransportPricingCard from '@client/components/cards/transport-pricing-card';
import AppInternalNotesCard from '@client/components/cards/internal-notes-card';
import AppFollowUpCard from '@client/components/cards/follow-up-card';
import AppPaymentHistoryCard from '@client/components/cards/payment-history-card';
import AppTermsAndConditionCard from '@client/components/cards/terms-and-condition-card';
import AppSelectInput from '@client/components/form/select-input';
import AppDispatchToCarrierDialog from '@client/components/dialogs/dispatch-to-carrier-dialog';
import AppGoogleMapCard from '@client/components/cards/google-map-card';
// import AppDocImageUploaderCard from '@client/components/cards/doc-image-uploader-card';

export default {
  name: 'AppQuoteDetail',
  metaInfo() {
    let title = 'Quote';
    if (this.isOrderContext) title = 'Order';

    return {
      title: !this.quote
        ? 'Quote Page'
        : `${this.quote.shipper.firstName} ${this.quote.shipper.lastName}'s ${title}`
    };
  },
  graphql,
  components: {
    AppCustomerInfoCard,
    AppLocationFilterableCard,
    AppVehicleDetailsCard,
    AppTransportInfoCard,
    AppTransportPricingCard,
    AppInternalNotesCard,
    AppFollowUpCard,
    AppPaymentHistoryCard,
    AppSelectInput,
    AppTermsAndConditionCard,
    AppDispatchToCarrierDialog,
    AppGoogleMapCard
    // AppDocImageUploaderCard,
  },
  props: {
    quoteId: String,
    quoteType: {
      type: String,
      default: 'quote'
    }
  },
  validations() {
    if (this.isQuoteContext) return quoteValidator;
    return orderValidator;
  },
  apollo: {
    currentUser: {
      query: graphql.queries.currentUser
    },
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
        async result(result) {
          if (result.loading) return;

          let theQuote = result.data.quote;
          if (this.isOrderContext) theQuote = result.data.order;
          Object.assign(this, theQuote);

          this.engagements = theQuote.engagements || [];

          if (!this.mapLoaded) {
            this.mapLoaded = true;

            this.$nextTick(() => {
              if (!theQuote.transport.miles) {
                this.$refs.transportInfoCardRef.calcDistance(
                  this.origin,
                  this.destination
                );
              }

              this.$refs.googleMapCardRef.refreshMap(
                this.origin,
                this.destination
              );
            });
          }

          const response = await this.$apollo.query({
            query: graphql.queries.findPossibleDuplicates,
            variables: { id: this.theQuoteId },
            fetchPolicy: 'network-only'
          });

          this.possibleDuplicates = response.data.findPossibleDuplicates;
        }
      };
    },
    quoteEvents: {
      query: graphql.queries.getQuoteEvents,
      variables() {
        return { id: this.theQuoteId };
      }
    },
    parentStatuses: {
      query: graphql.queries.getParentStatus,
      variables() {
        if (this.isOrderContext) return { type: 'ORDER' };
        return { type: 'QUOTE' };
      },
      watchLoading(isLoading) {
        this.loadingParentStatus = isLoading;
      }
    },
    emailTemplates: {
      query: graphql.queries.getEmailTemplates
    },
    smsTemplates: {
      query: graphql.queries.getSMSTemplates
    },
    users: {
      query: graphql.queries.loadUsers
    }
  },
  watch: {
    $route(to, from) {
      this.isEditingQuote = from.query.edit === 'true';
    }
  },
  created() {
    this.isEditingQuote = this.$route.query.edit === 'true';
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
      mapLoaded: false,
      possibleDuplicates: {
        byEmailPhone: [],
        byName: []
      },

      isEditingQuote: false,

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
      origin: {},
      destination: {},
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
      followups: [],

      terms: null,
      billingInfo: null,
      transactions: [],

      engagements: [],
      QUOTE_ENGAGEMENTS,
      QUOTE_ENGAGEMENT_FULLPAY,

      dispatch: null,

      saving: {
        engagements: {},
        referrer: false,
        assignee: false,
        shipper: {},
        origin: {},
        destination: {},
        vehicles: {
          index: -1
        },
        transport: {},
        internalNote: false,
        followups: false,
        billingInfo: false,
        chargeCustomer: false
      },
      loadingSave: false,

      dirty: {},

      duplicating: false,

      DISPATCHED_STATUS_ID: window.DISPATCHED_STATUS_ID
    };
  },
  computed: {
    theQuoteId() {
      return this.$route.params.id || this.quoteId;
    },
    isQuoteContext() {
      if (this.quoteId) return this.quoteType === 'quote';
      return this.$route.name === 'quote-detail';
    },
    isOrderContext() {
      if (this.quoteId) return this.quoteType === 'order';
      return this.$route.name === 'order-detail';
    },
    canContactShipper() {
      if (
        this.isQuoteContext &&
        assessPermission.quote.canContactShipper(this.currentUser)
      ) {
        return true;
      }

      return (
        this.isOrderContext &&
        assessPermission.order.canContactShipper(this.currentUser)
      );
    },
    canCreateQuote() {
      if (
        this.isQuoteContext &&
        assessPermission.quote.canCreate(this.currentUser)
      ) {
        return true;
      }

      return (
        this.isOrderContext &&
        assessPermission.order.canCreate(this.currentUser)
      );
    },
    canBookOrder() {
      return (
        this.isQuoteContext &&
        assessPermission.order.canCreate(this.currentUser)
      );
    },
    canConvertToQuote() {
      return (
        this.isOrderContext &&
        assessPermission.quote.canCreate(this.currentUser)
      );
    },
    canUpdateQuote() {
      if (
        this.isQuoteContext &&
        assessPermission.quote.canUpdate(this.currentUser)
      ) {
        return true;
      }

      return (
        this.isOrderContext &&
        assessPermission.order.canUpdate(this.currentUser)
      );
    },
    canDispatch() {
      return (
        this.isOrderContext &&
        assessPermission.order.canDispatchOnly(this.currentUser)
      );
    },
    canUpdateButNotPostToLoadBoardOnly() {
      return (
        this.isOrderContext &&
        assessPermission.order.canUpdate(this.currentUser) &&
        !assessPermission.order.canPostToLoadBoardOnly(this.currentUser)
      );
    },
    canNotUpdateButPostToLoadBoardOnly() {
      return (
        this.isOrderContext &&
        !assessPermission.order.canUpdate(this.currentUser) &&
        assessPermission.order.canPostToLoadBoardOnly(this.currentUser)
      );
    }
  },
  methods: {
    async handleSetEngagement(engagement) {
      if (this.engagements.includes(engagement)) {
        this.engagements = this.engagements.filter((e) => e !== engagement);
      } else {
        this.engagements = this.engagements.concat(engagement);
      }

      this.dirty.engagements = true;

      if (!this.isEditingQuote) {
        this.$set(this.saving, 'engagements', {
          ...this.saving.engagements,
          [engagement]: true
        });
        await this.updateFields({ engagements: this.engagements });
        this.$set(this.saving, 'engagements', {
          ...this.saving.engagements,
          [engagement]: false
        });
      }
    },
    async handleUpdateReferrer(value) {
      this.dirty.referrer = true;

      if (!this.isEditingQuote) {
        this.$set(this.saving, 'referrer', true);
        await this.updateFields({
          referrer: value ? value.value : null
        });
        this.$set(this.saving, 'referrer', false);
      }
    },
    async handleUpdateAssignee(value) {
      this.dirty.assignee = true;

      if (!this.isEditingQuote) {
        this.$set(this.saving, 'assignee', true);
        await this.updateFields({ assigneeId: parseInt(value.id, 10) });
        this.$set(this.saving, 'assignee', false);
      }
    },
    filterParentStatusFn(val, update) {
      update(() => {
        const needle = val.toLowerCase();
        this.parentStatusOptions = this.parentStatuses
          .filter((v) => v.name.toLowerCase().indexOf(needle) > -1)
          .map((status) => {
            if (this.canUpdateButNotPostToLoadBoardOnly) {
              return {
                ...status,
                disable: status.id === window.POST_TO_LOAD_BOARD_ID
              };
            }
            if (this.canNotUpdateButPostToLoadBoardOnly) {
              return {
                ...status,
                disable: status.id !== window.POST_TO_LOAD_BOARD_ID
              };
            }
            return status;
          });
      });
    },
    async handleParentStatusChange(value) {
      if (
        this.isOrderContext &&
        !assessPermission.order.canUpdate(this.currentUser) &&
        assessPermission.order.canPostToLoadBoardOnly(this.currentUser)
      ) {
        if (!value) {
          this.loadingParentStatus = true;

          await this.$apollo.mutate({
            mutation: graphql.mutations.removeFromLoadBoard,
            variables: {
              id: this.theQuoteId
            }
          });

          this.loadingParentStatus = false;
        } else if (value.id === window.POST_TO_LOAD_BOARD_ID) {
          this.loadingParentStatus = true;

          await this.$apollo.mutate({
            mutation: graphql.mutations.postToLoadBoard,
            variables: {
              id: this.theQuoteId
            }
          });

          this.loadingParentStatus = false;
        }
      } else {
        this.dirty.parentStatus = true;

        if (!this.isEditingQuote) {
          this.loadingParentStatus = true;
          if (value.childrenCount > 0) this.childStatusOptions = value.children;
          await this.updateFields({
            parentStatusId: value ? parseInt(value.id, 10) : null,
            childStatusId: null
          });
          this.loadingParentStatus = false;
        }
      }
    },
    filterChildStatusFn(val, update) {
      update(() => {
        const needle = val.toLowerCase();
        const parentStatus = this.parentStatuses.find(
          (s) => s.id === this.parentStatus.id
        );
        this.childStatusOptions = parentStatus
          ? parentStatus.children.filter(
              (v) => v.name.toLowerCase().indexOf(needle) > -1
            )
          : [];
      });
    },
    async handleChildStatusChange(value) {
      this.dirty.childStatus = true;

      if (!this.isEditingQuote) {
        this.loadingChildStatus = true;
        await this.updateFields({
          childStatusId: value ? parseInt(value.id, 10) : null
        });
        this.loadingChildStatus = false;
      }
    },
    async handleCustomerInfoUpdate(value) {
      this.validate(['shipper']);

      let savingKey = null;
      let shipperUpdate = null;
      if (value) {
        const { name, model } = value;
        this.shipper = { ...this.shipper, [name]: model };
        savingKey = name;
        shipperUpdate = { [name]: model };
      } else {
        savingKey = 'batch';
        shipperUpdate = sanitizeObject(this.shipper);
      }

      this.$set(this.saving, 'shipper', {
        ...this.saving.shipper,
        [savingKey]: true
      });
      await this.updateFields({ shipper: shipperUpdate });
      this.$set(this.saving, 'shipper', {
        ...this.saving.shipper,
        [savingKey]: false
      });
    },
    handleLocationChange(key) {
      this.dirty[key] = true;

      if (!this.origin.zipcode || !this.destination.zipcode) return;

      if (this.quote.origin.zipcode !== this.origin.zipcode) {
        this.$refs.transportInfoCardRef.calcDistance(
          this.origin,
          this.destination
        );
        this.$refs.googleMapCardRef.refreshMap(this.origin, this.destination);
      } else if (this.quote.destination.zipcode !== this.destination.zipcode) {
        this.$refs.transportInfoCardRef.calcDistance(
          this.origin,
          this.destination
        );
        this.$refs.googleMapCardRef.refreshMap(this.origin, this.destination);
      }
    },
    async handleLocationUpdate(key, names) {
      if (key === 'origin') {
        this.validate(['origin']);
      } else {
        this.validate(['destination']);
      }

      if (names.length === 0) {
        this.validate([key]);

        this.$set(this.saving, [key], { batch: true });
        await this.updateFields({
          [key]: sanitizeObject(this[key])
        });
        this.$set(this.saving, [key], { batch: false });
      } else if (names.length === 1) {
        const name = names[0];
        const model = this[key][name];
        this.validate([key]);

        this.$set(this.saving, [key], {
          ...this.saving[key],
          [name]: true
        });
        await this.updateFields({
          [key]: {
            [name]: model
          }
        });
        this.$set(this.saving, key, {
          ...this.saving[key],
          [name]: false
        });
      } else {
        this.validate([key]);

        this.$set(
          this.saving,
          [key],
          names.reduce((m, name) => ({ ...m, [name]: true }), this.saving[key])
        );
        await this.updateFields({
          [key]: sanitizeObject(
            names.reduce((m, name) => ({ ...m, [name]: this[key][name] }), {})
          )
        });
        this.$set(
          this.saving,
          [key],
          names.reduce((m, name) => ({ ...m, [name]: false }), this.saving[key])
        );
      }
    },
    async handleVehicleUpdate(id) {
      this.validate(['vehicles']);

      let payload;

      if (id < this.quote.vehicles.length) {
        payload = {
          vehicles: this.quote.vehicles
            .map((v, index) => {
              if (id !== index) return sanitizeObject(v);
              return sanitizeObject(this.vehicles[index]);
            })
            .map(({ size, ...v }) => {
              if (size) return { ...v, sizeId: size.id };
              return v;
            })
        };
      } else {
        payload = {
          vehicles: this.quote.vehicles
            .map((v) => sanitizeObject(v))
            .concat(sanitizeObject(this.vehicles[id]))
            .map(({ size, ...v }) => {
              if (size) return { ...v, sizeId: size.id };
              return v;
            })
        };
      }

      this.$set(this.saving, 'vehicles', { index: id });

      try {
        await this.updateFields(payload);
      } catch (error) {
        this.notifyNegative('Something went wrong. Please try again later');
      }

      this.$set(this.saving, 'vehicles', { index: -1 });
    },
    async handleUpdateTransportInformation(key) {
      this.validate(['transport']);

      const savingKey = key || 'batch';

      this.$set(this.saving, 'transport', {
        ...this.saving.transport,
        [savingKey]: true
      });
      await this.updateFields({
        transport: sanitizeObject(this.transport)
      });
      this.$set(this.saving, 'transport', {
        ...this.saving.transport,
        [savingKey]: false
      });
    },
    async handleUpdateFollowup() {
      this.$set(this.saving, 'followups', true);

      await this.updateFields({
        followups: this.followups.map((e) => {
          const followup = this.quote.followups.find(
            (f) => f.followupOn === e.followupOn
          );
          return followup ? sanitizeObject(followup) : e;
        })
      });

      this.$set(this.saving, 'followups', false);
    },
    async updateFields(data) {
      let gql = graphql.mutations.updateQuote;
      if (this.isOrderContext) gql = graphql.mutations.updateOrder;

      try {
        const response = await this.$apollo.mutate({
          mutation: gql,
          variables: {
            id: this.theQuoteId,
            input: data
          }
        });

        this.dirty = {};

        return response;
      } catch (error) {
        this.notifyNegative(error.message);
        return error;
      }
    },
    async updateQuote() {
      const changed = [];
      if (this.dirty.engagements) changed.push('engagements');
      if (this.dirty.referrer) changed.push('referrer');
      if (this.dirty.assignee) changed.push('assignee');
      if (this.dirty.parentStatus) changed.push('parentStatus');
      if (this.dirty.childStatus) changed.push('childStatus');
      if (this.dirty.origin) changed.push('origin');
      if (this.dirty.destination) changed.push('destination');
      if (this.dirty.shipper) changed.push('shipper');
      if (this.dirty.followups) changed.push('followups');
      if (this.dirty.vehicles) changed.push('vehicles');
      if (this.dirty.transport) changed.push('transport');
      if (this.dirty.internalNote) changed.push('internalNotes');

      const inputData = extractKeysIntoObject(this, changed);

      const payload = {};

      if (changed.includes('shipper')) {
        payload.shipper = sanitizeObject(inputData.shipper);
      }
      if (changed.includes('origin')) {
        payload.origin = sanitizeObject(inputData.origin);
      }
      if (changed.includes('destination')) {
        payload.destination = sanitizeObject(inputData.destination);
      }
      if (changed.includes('transport')) {
        payload.transport = sanitizeObject(inputData.transport);
      }
      if (changed.includes('vehicles')) {
        payload.vehicles = inputData.vehicles
          .map(sanitizeObject)
          .map(({ size, ...v }) => {
            if (size) return { ...v, sizeId: size.id };
            return v;
          });
      }
      if (changed.includes('assignee')) {
        payload.assigneeId = parseInt(inputData.assignee.id, 10);
      }
      if (changed.includes('referrer')) {
        payload.referrer = inputData.referrer ? inputData.referrer.value : null;
      }
      if (changed.includes('parentStatus')) {
        payload.parentStatusId = inputData.parentStatus
          ? parseInt(inputData.parentStatus.id, 10)
          : null;
      }
      if (changed.includes('childStatus')) {
        payload.childStatusId = inputData.childStatus
          ? parseInt(inputData.childStatus.id, 10)
          : null;
      }
      if (changed.includes('internalNotes')) {
        payload.internalNotes = inputData.internalNotes.map(sanitizeObject);
      }
      if (changed.includes('followups')) {
        payload.followups = inputData.followups.map((e) => {
          const followup = this.quote.followups.find(
            (f) => f.followupOn === e.followupOn
          );
          return followup ? sanitizeObject(followup) : e;
        });
      }
      if (changed.includes('engagements')) {
        payload.engagements = inputData.engagements;
      }

      if (Object.keys(payload).length > 0) {
        await this.updateFields(payload);
      }
    },
    async updateOrder() {
      const changed = [];
      if (this.dirty.engagements) changed.push('engagements');
      if (this.dirty.referrer) changed.push('referrer');
      if (this.dirty.assignee) changed.push('assignee');
      if (this.dirty.parentStatus) changed.push('parentStatus');
      if (this.dirty.childStatus) changed.push('childStatus');
      if (this.dirty.shipper) changed.push('shipper');
      if (this.dirty.origin) changed.push('origin');
      if (this.dirty.destination) changed.push('destination');
      if (this.dirty.vehicles) changed.push('vehicles');
      if (this.dirty.transport) changed.push('transport');
      if (this.dirty.internalNote) changed.push('internalNotes');

      const inputData = extractKeysIntoObject(this, changed);

      const payload = {};

      if (changed.includes('shipper')) {
        payload.shipper = sanitizeObject(inputData.shipper);
      }
      if (changed.includes('origin')) {
        payload.origin = sanitizeObject(inputData.origin);
      }
      if (changed.includes('destination')) {
        payload.destination = sanitizeObject(inputData.destination);
      }
      if (changed.includes('transport')) {
        payload.transport = sanitizeObject(inputData.transport);
      }
      if (changed.includes('vehicles')) {
        payload.vehicles = inputData.vehicles
          .map(sanitizeObject)
          .map(({ size, ...v }) => {
            if (size) return { ...v, sizeId: size.id };
            return v;
          });
      }
      if (changed.includes('assignee')) {
        payload.assigneeId = parseInt(inputData.assignee.id, 10);
      }
      if (changed.includes('referrer')) {
        payload.referrer = inputData.referrer ? inputData.referrer.value : null;
      }
      if (changed.includes('parentStatus')) {
        payload.parentStatusId = inputData.parentStatus
          ? parseInt(inputData.parentStatus.id, 10)
          : null;
      }
      if (changed.includes('childStatus')) {
        payload.childStatusId = inputData.childStatus
          ? parseInt(inputData.childStatus.id, 10)
          : null;
      }
      if (changed.includes('internalNotes')) {
        payload.internalNotes = inputData.internalNotes.map(sanitizeObject);
      }
      if (changed.includes('engagements')) {
        payload.engagements = inputData.engagements;
      }

      if (Object.keys(payload).length > 0) {
        await this.updateFields(payload);
      }
    },
    async handleUpdate() {
      this.validate([
        'shipper',
        'origin',
        'destination',
        'transport',
        'vehicles'
      ]);

      this.loadingSave = true;

      if (this.isQuoteContext) {
        await this.updateQuote();
      } else {
        await this.updateOrder();
      }

      this.loadingSave = false;
    },
    async handleAddInternalNote(note) {
      this.$set(this.saving, 'internalNote', true);

      await this.$apollo.mutate({
        mutation: graphql.mutations.addQuoteNote,
        variables: {
          input: {
            quoteId: this.theQuoteId,
            note
          }
        },
        update: () => {
          this.$apollo.queries.quoteEvents.refetch();
        }
      });

      this.$set(this.saving, 'internalNote', false);
    },
    async handleDeleteInternalNote(id) {
      await this.$apollo.mutate({
        mutation: graphql.mutations.deleteQuoteNote,
        variables: {
          id
        },
        update: () => {
          this.$apollo.queries.quoteEvents.refetch();
        }
      });
    },
    async handleUpdateInternalNote(id, note) {
      await this.$apollo.mutate({
        mutation: graphql.mutations.updateQuoteNote,
        variables: {
          id,
          input: {
            note: note.trim()
          }
        },
        update: () => {
          this.$apollo.queries.quoteEvents.refetch();
        }
      });
    },
    async handleDuplicate(mode) {
      this.duplicating = true;

      let gql = graphql.mutations.duplicateQuote;
      if (this.isOrderContext) gql = graphql.mutations.duplicateOrder;

      const data = await this.$apollo.mutate({
        mutation: gql,
        variables: {
          id: this.theQuoteId,
          mode
        }
      });

      this.duplicating = false;

      if (this.isQuoteContext) {
        const routerData = this.$router.resolve({
          name: 'quote-detail',
          params: { id: data.data.duplicateQuote.id },
          query: assessPermission.quote.canUpdate(this.currentUser)
            ? { edit: 'true' }
            : {}
        });
        window.open(routerData.href, '__blank');
      }

      if (this.isOrderContext) {
        const routerData = this.$router.resolve({
          name: 'order-detail',
          params: { id: data.data.duplicateOrder.id },
          query: assessPermission.quote.canUpdate(this.currentUser)
            ? { edit: 'true' }
            : {}
        });
        window.open(routerData.href, '__blank');
      }

      this.notifyPositive('The quote has been successfully duplicated');
    },
    async handleSendEmail(template) {
      await this.$apollo.mutate({
        mutation: graphql.mutations.sendQuoteEmail,
        variables: {
          id: this.theQuoteId,
          emailTemplateId: template.id
        }
      });
    },
    async handleSendSMS(template) {
      await this.$apollo.mutate({
        mutation: graphql.mutations.sendQuoteSMS,
        variables: {
          id: this.theQuoteId,
          smsTemplateId: template.id
        }
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
    handleConvert(toOrder) {
      let message = 'Are you sure you want to convert to an order?';
      if (!toOrder) {
        message = 'Are you sure you want to convert to a quote?';
      }

      this.$q
        .dialog({
          title: 'Confirm',
          message,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.$router.push({
            name: toOrder ? 'convert-to-order' : 'convert-to-quote',
            params: { id: this.theQuoteId }
          });
        });
    },
    async handleChangeBillingInfo(billingInfo) {
      this.$set(this.saving, 'billingInfo', true);

      await this.$apollo.mutate({
        mutation: graphql.mutations.setBillingInfoToOrder,
        variables: {
          orderId: this.theQuoteId,
          input: billingInfo
        }
      });

      this.$set(this.saving, 'billingInfo', true);
    },
    async handleChargeCustomer(data) {
      this.$set(this.saving, 'chargeCustomer', true);

      await this.$apollo.mutate({
        mutation: graphql.mutations.chargeOrder,
        variables: {
          orderId: this.theQuoteId,
          amount: data.amount,
          note: data.note
        }
      });

      this.$set(this.saving, 'chargeCustomer', false);
    },
    async handleSendTosEmail() {
      await this.$apollo.mutate({
        mutation: graphql.mutations.sendTermsAndConditionsEmail,
        variables: { id: this.theQuoteId }
      });
    },
    async handleSendBillingInfoEmail() {
      await this.$apollo.mutate({
        mutation: graphql.mutations.sendBillingInfoInputEmail,
        variables: { id: this.theQuoteId }
      });
    }
  }
};
</script>
