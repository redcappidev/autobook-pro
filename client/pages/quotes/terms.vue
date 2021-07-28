<template>
  <div class="autobookpro-page-content">
    <img class="lt-sm" src="../../assets/rr-logo.jpg" width="200px;" />
    <div class="q-my-md bg-white q-py-sm relative-position">
      <img
        class="absolute q-pl-sm gt-sm"
        src="../../assets/rr-logo.jpg"
        width="200px;"
      />
      <div class="text-center text-h4">Terms And Conditions</div>
      <div class="text-center text-subtitle1 gt-sm">
        Fill out the information below to accept our terms and conditions. Don't
        forget, you can call us if you have any questions! (888) 424-4420
      </div>
      <div class="text-center text-caption lt-sm">
        Fill out the information below to accept our terms and conditions. Don't
        forget, you can call us if you have any questions! (888) 424-4420
      </div>
    </div>
    <div flat bordered v-if="!loading && !invalidLink && !accepted">
      <app-terms-and-condition-card
        context="book"
        v-model="terms"
        :validation="$v.terms"
      />
      <div class="text-right q-mt-sm">
        <q-btn
          @click="handleSaveTerms"
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
    <div v-if="accepted">
      <h4 class="text-positive text-center">
        You already have accepted our terms and conditions. Thank you!
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
// import delayTouch from '@client/utils/delay-touch';
import AppTermsAndConditionCard from '@client/components/cards/terms-and-condition-card';

export default {
  name: 'AppTermsAndConditions',
  components: {
    AppTermsAndConditionCard
  },
  validations: clientFacingOrderValidator,
  data() {
    return {
      loading: false,
      invalidLink: false,
      saving: false,

      accepted: false,
      orderId: null,
      terms: {}
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
      mutation: graphql.mutations.resolveTermsAndConditionsLink,
      variables: { encryption: token }
    });
    const { resolveTermsAndConditionsLink: data } = response.data;
    if (!data) {
      this.invalidLink = true;
    } else {
      this.orderId = data.orderId;
      this.terms = data.terms || {};
      this.accepted = this.terms.accepted;
    }
    this.loading = false;
  },
  methods: {
    async handleSaveTerms() {
      this.validate(['terms']);

      this.saving = true;

      try {
        const { token } = this.$route.params;

        const inputData = extractKeysIntoObject(this, ['terms']);
        await this.$apollo.mutate({
          mutation: graphql.mutations.acceptTermsAndConditions,
          variables: {
            encryption: token,
            input: sanitizeObject(inputData.terms)
          }
        });

        this.accepted = true;
      } catch (error) {
        this.notifyNegative(error.message);
      }

      this.saving = false;
    }
  }
};
</script>

<style></style>
