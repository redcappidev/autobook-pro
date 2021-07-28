<template>
  <q-card flat bordered>
    <q-card-section class="q-pa-sm">
      <div class="text-subtitle1 text-bold q-px-sm">
        <q-icon
          name="credit_card"
          style="font-size: 25px; padding-right: 0.1rem;"
        />
        Card Information
      </div>
    </q-card-section>

    <q-separator />
    <q-card-section>
      <app-editable-input
        :data="value.cardNumber"
        text="Card Number *"
        name="cardNumber"
        mask="#### #### #### ####"
        @input="
          handleChangeInput($event);
          if (validation.cardNumber.$dirty)
            delayTouch(validation.cardNumber, $options.touchMap);
        "
        :error="validation.cardNumber.$error"
      />
      <app-select-input
        text="Expire Month *"
        :value="value.exprMonth"
        :options="exprMonthOptions"
        @input="
          handleChangeSelect('exprMonth', $event);
          delayTouch(validation.exprMonth, $options.touchMap);
        "
        :error="validation.exprMonth.$error"
      />
      <app-select-input
        text="Expire Year *"
        :value="value.exprYear"
        :options="exprYearOptions"
        @input="
          handleChangeSelect('exprYear', $event);
          delayTouch(validation.exprYear, $options.touchMap);
        "
        :error="validation.exprYear.$error"
      />
      <app-editable-input
        :data="value.cvv"
        text="CVV *"
        name="cvv"
        @input="
          handleChangeInput($event);
          delayTouch(validation.cvv, $options.touchMap);
        "
        :error="validation.cvv.$error"
      />
    </q-card-section>
  </q-card>
</template>

<script>
import AppEditableInput from '@client/components/form/editable-input';
import AppSelectInput from '@client/components/form/select-input';

export default {
  name: 'AppCreditCardDetailsCard',
  props: {
    value: Object,
    validation: Object
  },
  components: {
    AppEditableInput,
    AppSelectInput
  },
  data() {
    return {
      exprMonthOptions: [
        '01',
        '02',
        '03',
        '04',
        '05',
        '06',
        '07',
        '08',
        '09',
        '10',
        '11',
        '12'
      ],
      exprYearOptions: [
        '2021',
        '2022',
        '2023',
        '2024',
        '2025',
        '2026',
        '2027',
        '2028',
        '2029'
      ]
    };
  },
  methods: {
    handleChangeInput(value) {
      const { name, model } = value;
      if (name === 'cardNumber') {
        this.$emit('input', {
          ...this.value,
          [name]: model.split(' ').join('')
        });
      } else {
        this.$emit('input', {
          ...this.value,
          [name]: model
        });
      }
    },
    handleChangeSelect(name, model) {
      this.$emit('input', {
        ...this.value,
        [name]: model
      });
    }
  }
};
</script>
<style lang="scss"></style>
