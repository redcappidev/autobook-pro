<template>
  <q-card flat bordered>
    <q-card-section class="q-pa-sm bg-primary">
      <div class="text-subtitle1 text-bold">
        <q-icon
          name="emoji_transportation"
          style="font-size: 25px; padding-right: 0.1rem;"
        />
        Transport Information
      </div>
    </q-card-section>

    <q-separator />
    <q-card-section>
      <app-select-input
        :loadingData="loadingData"
        :readonly="readonly"
        text="Carrier *"
        v-model="value.carrierType"
        :options="['OPEN', 'ENCLOSED']"
        @input="handleChange({ name: 'carrierType', model: $event })"
      />
      <app-editable-input
        v-if="context !== 'quick-quote'"
        :loadingData="loadingData"
        :data="value.availableDate"
        :readonly="readonly || action === 'view'"
        type="date"
        name="availableDate"
        text="Available Date *"
        @input="
          handleChange($event);
          delayTouch(validation.availableDate, $options.touchMap);
        "
        :error="validation.availableDate.$error"
      />
      <app-editable-input
        v-if="context !== 'quick-quote'"
        :loadingData="loadingData"
        :data="value.miles"
        :readonly="true"
        type="text"
        name="miles"
        text="Distance(miles)"
      />
    </q-card-section>
  </q-card>
</template>
<script>
import AppEditableInput from '@client/components/form/editable-input';
import AppSelectInput from '@client/components/form/select-input';

export default {
  name: 'AppTransportInfoCard',
  components: {
    AppEditableInput,
    AppSelectInput
  },
  props: {
    loadingData: {
      type: Boolean,
      default: false
    },
    value: Object,
    context: {
      type: String,
      default: 'quote'
    },
    readonly: Boolean,
    action: {
      type: String,
      default: 'create'
    },
    validation: Object,
    saving: {
      type: Object,
      default: function () {
        return {};
      }
    }
  },
  methods: {
    handleChange(value) {
      this.$emit('input', {
        ...this.value,
        [value.name]: value.model
      });

      if (this.action === 'view') {
        this.$emit('update', value.name);
      }
    },
    async calcDistance(origin, destination) {
      const res = await fetch(
        `/rest-api/distance?origin=${origin.zipcode}&destination=${destination.zipcode}`
      );
      const miles = await res.json();
      this.$emit('input', { ...this.value, miles });
    }
  }
};
</script>
<style lang="scss"></style>
