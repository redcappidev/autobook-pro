<template>
  <q-dialog :value="open" @hide="closeDialog">
    <q-card v-if="open">
      <q-card-section class="text-center">
        <div class="text-h6 text-weight-medium">
          Order Manual Charge
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section class="q-gutter-y-sm">
        <app-editable-input
          :data="amount"
          :readonly="false"
          text="Charge Amount *"
          name="amount"
          type="number"
          @input="
            amount = $event.model;
            delayTouch($v.amount, $options.touchMap);
          "
          :error="$v.amount.$error"
        />
        <app-editable-input
          :data="note"
          :readonly="false"
          text="Charge Note"
          name="note"
          type="textarea"
          @input="note = $event.model"
        />
      </q-card-section>
      <q-separator />
      <q-card-actions align="right">
        <q-btn flat label="Charge" color="primary" @click="handleCharge" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { required } from 'vuelidate/lib/validators';
import AppEditableInput from '@client/components/form/editable-input';

export default {
  name: 'AppChargeOrderDialog',
  components: {
    AppEditableInput
  },
  validations: {
    amount: { required }
  },
  data() {
    return {
      open: false,
      amount: 0,
      note: ''
    };
  },
  methods: {
    openDialog() {
      this.$v.$reset();
      this.amount = 0;
      this.note = '';
      this.open = true;
    },
    closeDialog() {
      this.open = false;
    },
    handleCharge() {
      this.validate(['amount']);
      this.$emit('on-charge', {
        amount: parseInt(this.amount, 10),
        note: this.note
      });
      this.closeDialog();
    }
  }
};
</script>

<style></style>
