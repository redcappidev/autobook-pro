<template>
  <q-card flat bordered>
    <q-card-section class="q-pa-sm bg-primary row justify-between items-center">
      <div class="text-subtitle1 text-bold">
        <q-icon
          name="attach_money"
          style="font-size: 25px; padding-right: 0.1rem;"
        />
        Pricing
      </div>
      <div class="row items-center q-gutter-x-sm">
        <slot name="header"></slot>
        <q-btn
          v-if="!readonly && action === 'view' && !inBatchUpdating"
          icon="edit"
          color="secondary"
          dense
          flat
          size="sm"
          @click="inBatchUpdating = true"
        />
        <q-btn
          v-if="!readonly && action === 'view' && inBatchUpdating"
          icon="check"
          color="primary"
          dense
          flat
          size="sm"
          @loading="Boolean(saving.batch)"
          @click="handleBatchUpdate"
        />
        <q-btn
          v-if="!readonly && action === 'view' && inBatchUpdating"
          icon="cancel"
          color="red"
          dense
          flat
          size="sm"
          @click="inBatchUpdating = false"
        />
        <q-btn
          v-if="!readonly"
          outline
          label="Run Auto Quoter"
          size="sm"
          :loading="runningTaq"
          @click="$emit('run-taq')"
        />
      </div>
    </q-card-section>
    <q-separator />
    <q-card-section>
      <div class="row q-col-gutter-x-sm">
        <app-editable-input
          class="col"
          :loadingData="loadingData"
          :readonly="isReadOnlyField"
          :data="value.basePrice"
          prefix="$"
          type="number"
          min="0"
          text="Base Price *"
          name="basePrice"
          @input="
            delayTouch(validation.basePrice, $options.touchMap);
            handleChange($event);
          "
          :error="validation.basePrice.$error"
        />
        <app-editable-input
          class="col"
          :loadingData="loadingData"
          :readonly="isReadOnlyField"
          :data="value.deposit"
          prefix="$"
          min="0"
          type="number"
          text="Deposit *"
          name="deposit"
          @input="
            delayTouch(validation.deposit, $options.touchMap);
            handleChange($event);
          "
          :error="validation.deposit.$error"
        />
      </div>
      <div class="row q-col-gutter-x-sm">
        <app-editable-input
          class="col"
          :loadingData="loadingData"
          :readonly="isReadOnlyField"
          :data="value.sizeFee"
          prefix="$"
          min="0"
          type="number"
          text="Size Fee"
          name="sizeFee"
          @input="handleChange($event)"
        />
        <app-editable-input
          class="col"
          :loadingData="loadingData"
          :readonly="isReadOnlyField"
          :data="value.inopFee"
          prefix="$"
          min="0"
          type="number"
          text="Inop Fee"
          name="inopFee"
          @input="handleChange($event)"
        />
      </div>
      <div class="row q-col-gutter-x-sm">
        <app-editable-input
          class="col"
          :loadingData="loadingData"
          :readonly="isReadOnlyField"
          :data="value.enclosedFee"
          prefix="$"
          min="0"
          type="number"
          text="Enclosed"
          name="enclosedFee"
          @input="handleChange($event)"
        />
        <app-editable-input
          v-if="fullPayEnabled"
          class="col"
          :loadingData="loadingData"
          :readonly="true"
          :data="value.fullPay"
          prefix="$"
          min="0"
          type="number"
          text="Full Pay"
          name="fullPay"
        />
        <div class="col" v-else></div>
      </div>
      <div class="row justify-center q-mt-sm">
        <span class="text-weight-bold text-h6 text-positive">
          Total Price: ${{ value.totalPrice }}
        </span>
      </div>
    </q-card-section>
  </q-card>
</template>
<script>
import AppEditableInput from '@client/components/form/editable-input';

export default {
  name: 'AppTransportPricingCard',
  components: {
    AppEditableInput
  },
  props: {
    loadingData: {
      type: Boolean,
      default: false
    },
    value: Object,
    fullPayEnabled: Boolean,
    runningTaq: {
      type: Boolean,
      default: false
    },
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
  data() {
    return {
      inBatchUpdating: false
    };
  },
  computed: {
    isReadOnlyField() {
      if (this.saving.batch) return true;
      if (this.inBatchUpdating) return false;
      return this.readonly || this.action === 'view';
    }
  },
  watch: {
    saving: function (newVal, oldVal) {
      if (oldVal.batch && !newVal.batch) {
        this.inBatchUpdating = false;
      }
    }
  },
  methods: {
    handleChange(value) {
      const { name, model } = value;

      const newValue = {
        ...this.value,
        [name]: parseFloat(model)
      };
      const {
        basePrice = 0,
        sizeFee = 0,
        inopFee = 0,
        enclosedFee = 0,
        deposit = 0
      } = newValue;

      let totalPrice = basePrice + sizeFee + inopFee + enclosedFee + deposit;

      if (this.fullPayEnabled) {
        newValue.fullPay = Math.floor(totalPrice * 0.03);
        totalPrice += newValue.fullPay;
      } else {
        newValue.fullPay = 0;
      }

      newValue.totalPrice = totalPrice;

      this.$emit('input', newValue);
    },
    handleBatchUpdate() {
      if (this.action === 'view') {
        this.$emit('update');
      }
    }
  }
};
</script>
<style lang="scss"></style>
