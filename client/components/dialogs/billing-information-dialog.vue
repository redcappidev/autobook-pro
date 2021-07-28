<template>
  <q-dialog :value="open" @hide="closeDialog" @show="onShow">
    <q-card ref="dialogCard" v-if="open">
      <q-card-section
        class="text-center"
        style="cursor: move;"
        ref="dialogHeader"
      >
        <div class="text-h6 text-weight-medium">
          Billing Information
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section class="q-gutter-y-sm">
        <app-billing-address-card
          v-model="billingAddress"
          :validation="$v.billingAddress"
          @use-info="handleUseInfo"
        />
        <app-credit-card-details-card
          v-model="creditCard"
          :validation="$v.creditCard"
        />
      </q-card-section>
      <q-separator />
      <q-card-actions align="right">
        <q-btn outline label="Save" color="primary" @click="handleSave" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import {
  billingAddressValidator,
  creditCardValidator
} from '@client/validators';
import { extractKeysIntoObject } from '@client/utils/object-helpers';
import AppBillingAddressCard from '../cards/billing-address-card';
import AppCreditCardDetailsCard from '../cards/credit-card-details-card';

export default {
  name: 'AppBillingInformationDialog',
  components: {
    AppBillingAddressCard,
    AppCreditCardDetailsCard
  },
  validations: {
    billingAddress: billingAddressValidator,
    creditCard: creditCardValidator
  },
  data() {
    return {
      open: false,
      billingAddress: {},
      creditCard: {},
      meta: {},
      nodeDragg: null
    };
  },
  methods: {
    openDialog(meta) {
      this.$v.$reset();
      this.billingAddress = {};
      this.creditCard = {};
      this.meta = meta;
      this.open = true;
    },
    closeDialog() {
      this.onHide();
      this.open = false;
    },
    onShow() {
      this.nodeDragg = this.$refs.dialogHeader.$el;
      this.nodeDragg.addEventListener('mousedown', this.onGrab);
    },
    onHide() {
      document.removeEventListener('mousemove', this.onDrag);
      document.removeEventListener('mouseup', this.onLetGo);
      this.nodeDragg.removeEventListener('mousedown', this.onGrab);
    },
    onGrab() {
      document.addEventListener('mousemove', this.onDrag);
      document.addEventListener('mouseup', this.onLetGo);
    },
    onDrag(e) {
      const target = this.$refs.dialogCard.$el;
      const originalStyles = window.getComputedStyle(target);
      target.style.left = `${
        parseInt(originalStyles.left, 10) + e.movementX
      }px`;
      target.style.top = `${parseInt(originalStyles.top, 10) + e.movementY}px`;
    },
    onLetGo() {
      document.removeEventListener('mousemove', this.onDrag);
      document.removeEventListener('mouseup', this.onLetGo);
    },
    handleSave() {
      this.validate(['billingAddress', 'creditCard']);
      this.$emit('on-save', {
        billingAddress: this.billingAddress,
        creditCard: this.creditCard
      });
      this.closeDialog();
    },
    handleUseInfo(target) {
      const billingAddress = extractKeysIntoObject(this.meta[target], [
        'companyName',
        'firstName',
        'lastName',
        'email',
        'address',
        'city',
        'state',
        'zipcode'
      ]);

      this.billingAddress = billingAddress;
    }
  }
};
</script>

<style></style>
