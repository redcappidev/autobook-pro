<template>
  <q-card flat bordered>
    <q-card-section class="q-pa-sm row justify-between items-center">
      <div class="text-subtitle1 text-bold">
        <q-icon name="phone" style="font-size: 25px; padding-right: 0.1rem;" />
        Ring Central
      </div>
      <q-btn
        outline
        label="Save"
        size="sm"
        :loading="saving"
        @click="handleSave"
      />
    </q-card-section>

    <q-separator />
    <q-card-section>
      <div class="row q-col-gutter-x-sm">
        <app-editable-input
          :loadingData="loading"
          class="col"
          :data="number"
          type="tel"
          text="Phone *"
          name="number"
          disablePhoneCall
          mask="+1 (###) ### - ####"
          unmasked-value
          @input="handleChange"
          :error="$v.number.$error"
        />
        <app-editable-input
          :loadingData="loading"
          class="col"
          :data="extension"
          text="Extension *"
          name="extension"
          @input="handleChange"
          :error="$v.extension.$error"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import graphql from '@client/graphql';
import { required } from 'vuelidate/lib/validators';
import AppEditableInput from '@client/components/form/editable-input';

export default {
  name: 'AppRingCentralIntegrationCard',
  components: {
    AppEditableInput
  },
  validations: {
    number: { required },
    extension: { required }
  },
  apollo: {
    phoneNumber: {
      query: graphql.queries.getPhoneNumber,
      watchLoading(isLoading) {
        this.loading = isLoading;
      },
      error(error) {
        this.error = error;
      },
      result(result) {
        if (result.loading) return;

        Object.assign(this, result.data.phoneNumber);
      }
    }
  },
  data() {
    return {
      loading: false,
      error: null,
      saving: false,

      number: null,
      extension: null
    };
  },
  methods: {
    handleChange(event) {
      this[event.name] = event.model;
      this.delayTouch(this.$v[event.name], this.$options.touchMap);
    },
    async handleSave() {
      this.validate(['number', 'extension']);

      this.saving = true;
      try {
        await this.$apollo.mutate({
          mutation: graphql.mutations.setPhoneNumber,
          variables: {
            number: `+1${this.number}`,
            extension: this.extension
          }
        });
      } catch (error) {
        this.notifyNegative(error.message);
      }
      this.saving = false;
    }
  }
};
</script>

<style></style>
