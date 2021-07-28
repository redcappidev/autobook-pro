<template>
  <div class="autobookpro-page-content">
    <img class="lt-sm" src="../../assets/rr-logo.jpg" width="200px;" />
    <div class="q-my-md bg-white q-py-sm relative-position">
      <img
        class="absolute q-pl-sm gt-sm"
        src="../../assets/rr-logo.jpg"
        width="200px;"
      />
      <div class="text-center text-h4">Book Order</div>
      <div class="text-center text-subtitle1 gt-sm">
        Fill out the information below to complete your booking. Don't forget,
        you can call us if you have any questions! (888) 424-4420
      </div>
      <div class="text-center text-caption lt-sm">
        Fill out the information below to complete your booking. Don't forget,
        you can call us if you have any questions! (888) 424-4420
      </div>
    </div>
    <q-stepper
      v-if="!invalidLink && !isOrder"
      flat
      bordered
      keep-alive
      v-model="step"
      vertical
      color="primary"
      animated
    >
      <q-step
        :name="1"
        title="Shipping Information"
        icon="person"
        :done="step > 1"
      >
        <div class="row q-col-gutter-sm">
          <div :class="customerInfoClass">
            <app-customer-info-card
              context="book"
              action="edit"
              :value="shipper"
              @input="
                shipper = $event;
                dirty.shipper = true;
              "
              :validation="$v.shipper"
            />
          </div>
          <div :class="transportInfoClass">
            <q-card flat bordered>
              <q-card-section class="q-pa-sm">
                <div class="text-subtitle1 text-bold">
                  <q-icon
                    name="directions_car"
                    style="font-size: 25px; padding-right: 0.1rem;"
                  />
                  Transport
                </div>
              </q-card-section>
              <q-separator />
              <q-card-section class="q-gutter-y-sm">
                <div
                  class="q-gutter-y-sm"
                  v-for="(vehicle, index) in vehicles"
                  :key="index"
                >
                  <div>
                    <span class="text-weight-medium">Year:</span>
                    {{ vehicle.year }}
                  </div>
                  <div>
                    <span class="text-weight-medium">Make:</span>
                    {{ vehicle.make }}
                  </div>
                  <div>
                    <span class="text-weight-medium">Model:</span>
                    {{ vehicle.model }}
                  </div>
                </div>
                <div>
                  <span class="text-weight-medium">Available Date:</span>
                  {{ transport.availableDate | usDateFormat }}
                </div>
                <div>
                  <span class="text-weight-medium">Carrier Type:</span>
                  {{ transport.carrierType }}
                </div>
                <div>
                  <span class="text-weight-medium">Price:</span>
                  {{ transport.totalPrice | currency }}
                </div>
              </q-card-section>
            </q-card>
          </div>
          <div :class="originInfoClass">
            <app-location-filterable-card
              context="book"
              action="edit"
              label="Origin"
              :value="origin"
              @input="
                origin = $event;
                dirty.shipper = true;
              "
              :validation="$v.origin"
            />
          </div>
          <div :class="destinationInfoClass">
            <app-location-filterable-card
              context="book"
              action="edit"
              label="Destination"
              :value="destination"
              @input="
                destination = $event;
                dirty.shipper = true;
              "
              :validation="$v.destination"
            />
          </div>
        </div>

        <q-stepper-navigation>
          <q-btn
            @click="handleSaveShipperInfo"
            color="primary"
            :label="`${dirty.shipper ? 'Save' : 'Continue'}`"
            outline
            :loading="saving"
          />
        </q-stepper-navigation>
      </q-step>

      <q-step
        :name="2"
        title="Terms and Condition"
        icon="thumb_up_alt"
        :done="step > 2"
      >
        <app-terms-and-condition-card
          context="book"
          :value="terms"
          @input="
            terms = $event;
            dirty.terms = true;
          "
          :validation="$v.terms"
        />

        <q-stepper-navigation>
          <q-btn
            @click="handleSaveTerms"
            color="primary"
            :label="`${dirty.terms ? 'Save' : 'Continue'}`"
            outline
            :loading="saving"
          />
          <q-btn flat @click="step = 1" color="primary" label="Back" />
        </q-stepper-navigation>
      </q-step>

      <q-step
        :name="3"
        title="Billing Information"
        icon="credit_card"
        :done="step > 3"
      >
        <div class="text-subtitle2 q-mb-sm">
          Your credit card will not be charged until a certified carrier is
          assigned to your transport. The site is secured with 256-bit SSL
          Encryption Protocol. Your info is safe
        </div>
        <div :class="billingInfoClass">
          <div class="col">
            <app-billing-address-card
              context="book"
              :value="billingAddress"
              @input="
                billingAddress = $event;
                dirty.billing = true;
              "
              @use-info="handleUseInfo"
              :validation="$v.billingAddress"
            />
          </div>
          <div class="col">
            <app-credit-card-details-card
              :value="creditCard"
              @input="
                creditCard = $event;
                dirty.billing = true;
              "
              :validation="$v.creditCard"
            />
          </div>
        </div>

        <q-stepper-navigation>
          <q-btn
            @click="handleBookOrder"
            color="primary"
            label="Book Order"
            outline
            :loading="saving"
          />
          <q-btn flat @click="step = 2" color="primary" label="Back"></q-btn>
        </q-stepper-navigation>
      </q-step>
    </q-stepper>
    <div v-if="invalidLink">
      <h3 class="text-negative text-center">Sorry! This request is invalid!</h3>
    </div>
    <div v-if="isOrder">
      <h4 class="text-positive text-center">
        This order has been placed over. Thank you!
      </h4>
    </div>
  </div>
</template>
<script>
import { clientFacingOrderValidator } from '@client/validators';
import {
  extractKeysIntoObject,
  sanitizeObject
} from '@client/utils/object-helpers';
import graphql from '@client/graphql';
import delayTouch from '@client/utils/delay-touch';
import AppCustomerInfoCard from '@client/components/cards/customer-info-card';
import AppLocationFilterableCard from '@client/components/cards/location-filterable-card';
import AppTermsAndConditionCard from '@client/components/cards/terms-and-condition-card';
import AppBillingAddressCard from '@client/components/cards/billing-address-card';
import AppCreditCardDetailsCard from '@client/components/cards/credit-card-details-card';
// import AppGoogleMapViewLocation from '@client/components/cards/google-map-view-location';

export default {
  name: 'AppBookOrder',
  components: {
    AppCustomerInfoCard,
    AppLocationFilterableCard,
    AppTermsAndConditionCard,
    AppBillingAddressCard,
    AppCreditCardDetailsCard
    // AppGoogleMapViewLocation,
  },
  validations: clientFacingOrderValidator,
  data() {
    return {
      step: 1,
      saving: false,
      dirty: {},
      invalidLink: false,

      shipper: {},
      origin: {},
      destination: {},
      vehicles: [],
      transport: {},
      terms: {},
      billingAddress: {},
      creditCard: {},
      isOrder: false
    };
  },
  computed: {
    customerInfoClass() {
      if (this.$q.screen.lt.sm) return 'col-12';
      return 'col-8';
    },
    transportInfoClass() {
      if (this.$q.screen.lt.sm) return 'col-12';
      return 'col-4';
    },
    originInfoClass() {
      if (this.$q.screen.lt.sm) return 'col-12';
      return 'col';
    },
    destinationInfoClass() {
      if (this.$q.screen.lt.sm) return 'col-12';
      return 'col';
    },
    locationClass() {
      if (this.$q.screen.lt.sm) return 'q-gutter-y-sm';
      return 'row q-gutter-x-sm';
    },
    shippingClass() {
      if (this.$q.screen.lt.sm) return 'q-gutter-y-sm';
      return 'row q-gutter-x-sm';
    },
    billingInfoClass() {
      if (this.$q.screen.lt.sm) return 'q-gutter-y-sm';
      return 'row q-gutter-x-sm';
    }
  },
  async mounted() {
    const { token } = this.$route.params;
    if (!token) {
      this.$router.push({ name: 'home' });
      return;
    }

    const response = await this.$apollo.mutate({
      mutation: graphql.mutations.resolveBookOrderLink,
      variables: { encryption: token }
    });
    const { resolveBookOrderLink } = response.data;
    if (!resolveBookOrderLink) {
      this.invalidLink = true;
    } else {
      Object.assign(this, {
        ...resolveBookOrderLink,
        terms: resolveBookOrderLink.terms || {}
      });
    }
  },
  methods: {
    handleUseInfo(target) {
      const billingAddress = extractKeysIntoObject(this[target], [
        'companyName',
        'firstName',
        'lastName',
        'email',
        'address',
        'city',
        'state',
        'zipcode'
      ]);
      this.$set(this, 'billingAddress', billingAddress);
    },
    updateQuote(data) {
      const { token } = this.$route.params;

      return this.$apollo.mutate({
        mutation: graphql.mutations.updateQuoteByCustomer,
        variables: {
          encryption: token,
          input: data
        }
      });
    },
    async handleSaveShipperInfo() {
      this.validate(['shipper', 'origin', 'destination']);

      if (!this.dirty.shipper) {
        this.step = 2;
      } else {
        this.saving = true;

        try {
          const inputData = extractKeysIntoObject(this, [
            'shipper',
            'origin',
            'destination'
          ]);
          const origin = extractKeysIntoObject(inputData.origin, [
            'name',
            'address',
            'address2',
            'phone',
            'phone2'
          ]);
          const destination = extractKeysIntoObject(inputData.origin, [
            'name',
            'address',
            'address2',
            'phone',
            'phone2'
          ]);
          await this.updateQuote({
            shipper: sanitizeObject(inputData.shipper),
            origin: sanitizeObject(origin),
            destination: sanitizeObject(destination)
          });
          this.step = 2;
        } catch (error) {
          this.notifyNegative(error.message);
        }

        this.saving = false;
        this.$set(this.dirty, 'shipper', false);
      }
    },
    async handleSaveTerms() {
      this.validate(['terms']);

      if (!this.dirty.terms) {
        this.step = 3;
      } else {
        this.saving = true;

        try {
          const inputData = extractKeysIntoObject(this, ['terms']);
          await this.updateQuote({
            terms: sanitizeObject(inputData.terms)
          });
          this.step = 3;
        } catch (error) {
          this.notifyNegative(error.message);
        }

        this.saving = false;
      }
    },
    async handleBookOrder() {
      this.validate(['billingAddress', 'creditCard']);

      this.saving = true;
      if (this.dirty.billing) {
        try {
          const inputData = extractKeysIntoObject(this, [
            'billingAddress',
            'creditCard'
          ]);
          await this.updateQuote({
            billingInformation: {
              billingAddress: sanitizeObject(inputData.billingAddress),
              creditCard: sanitizeObject(inputData.creditCard)
            }
          });
          this.isOrder = true;
        } catch (error) {
          this.notifyNegative(error.message);
        }
      }
      this.saving = false;
    },
    delayTouch
  }
};
</script>
<style lang="scss"></style>
