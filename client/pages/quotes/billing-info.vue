<template>
  <div class="autobookpro-page-content">
    <img class="lt-sm" src="../../assets/rr-logo.jpg" width="200px;" />
    <div class="q-my-md bg-white q-py-sm relative-position">
      <img
        class="absolute q-pl-sm gt-sm"
        src="../../assets/rr-logo.jpg"
        width="200px;"
      />
      <div class="text-center text-h4">Billing Information</div>
      <div class="text-center text-subtitle1 gt-sm">
        Fill out the information below to complete your booking. Don't forget,
        you can call us if you have any questions! (888) 424-4420
      </div>
      <div class="text-center text-caption lt-sm">
        Fill out the information below to complete your booking. Don't forget,
        you can call us if you have any questions! (888) 424-4420
      </div>
    </div>
    <div v-if="!loading && !invalidLink && !submitted">
      <div class="text-subtitle2 q-mb-sm">
        Your credit card will not be charged until a certified carrier is
        assigned to your transport. The site is secured with 256-bit SSL
        Encryption Protocol. Your info is safe
      </div>
      <div :class="billingInfoClass">
        <div class="col">
          <app-billing-address-card
            context="book"
            disableUseInfo
            v-model="billingAddress"
            :validation="$v.billingAddress"
          />
        </div>
        <div class="col">
          <app-credit-card-details-card
            v-model="creditCard"
            :validation="$v.creditCard"
          />
        </div>
      </div>
      <div class="text-right q-mt-sm">
        <q-btn
          @click="handleSaveBillingInfo"
          color="primary"
          label="Save"
          outline
          :loading="saving"
        />
      </div>
    </div>
    <div v-if="invalidLink">
      <h3 class="text-negative text-center">Sorry! This request is invalid!</h3>
    </div>
    <div v-if="submitted">
      <h4 class="text-positive text-center">
        Thanks for providing your billing information!
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
import AppBillingAddressCard from '@client/components/cards/billing-address-card';
import AppCreditCardDetailsCard from '@client/components/cards/credit-card-details-card';

export default {
  name: 'AppBillingInformation',
  components: {
    AppBillingAddressCard,
    AppCreditCardDetailsCard
  },
  computed: {
    billingInfoClass() {
      if (this.$q.screen.lt.sm) return 'q-gutter-y-sm';
      return 'row q-gutter-x-sm';
    }
  },
  validations: clientFacingOrderValidator,
  data() {
    return {
      loading: false,
      invalidLink: false,
      saving: false,
      submitted: false,

      billingAddress: {},
      creditCard: {}
    };
  },
  async mounted() {
    const { token } = this.$route.params;
    if (!token) {
      this.$router.push({ name: 'home' });
      return;
    }

    this.loading = true;

    const response = await this.$apollo.mutate({
      mutation: graphql.mutations.resolveBillingInformationLink,
      variables: { encryption: token }
    });
    const { resolveBillingInformationLink: data } = response.data;
    this.invalidLink = !data;

    this.loading = false;
  },
  methods: {
    async handleSaveBillingInfo() {
      this.validate(['billingAddress', 'creditCard']);

      this.saving = true;

      try {
        const { token } = this.$route.params;

        const inputData = extractKeysIntoObject(this, [
          'billingAddress',
          'creditCard'
        ]);
        await this.$apollo.mutate({
          mutation: graphql.mutations.provideBillingInfo,
          variables: {
            encryption: token,
            input: {
              billingAddress: sanitizeObject(inputData.billingAddress),
              creditCard: sanitizeObject(inputData.creditCard)
            }
          }
        });

        this.submitted = true;
      } catch (error) {
        this.notifyNegative(error.message);
      }

      this.saving = false;
    }
  }
};
</script>

<style></style>
