import get from 'lodash/get';
import numeral from 'numeral';
import { formatString } from '@server/lib/date-format';
import { getFormattedPhoneNumber } from '@server/lib/phone-format';
import delayTouch from '@client/utils/delay-touch';

export default {
  touchMap: new WeakMap(),
  filters: {
    localTime: function (value) {
      return formatString(value);
    },
    currency: function (value) {
      return numeral(value).format('$0,0.00');
    },
    usDateFormat: function (value) {
      return formatString(value, 'MM/dd/yyyy');
    },
    phoneNumber: function (value) {
      return getFormattedPhoneNumber(value, 'INTERNATIONAL');
    }
  },
  methods: {
    notifyPositive(message) {
      this.$q.notify({
        type: 'positive',
        message
      });
    },

    notifyNegative(message) {
      this.$q.notify({
        type: 'negative',
        message
      });
    },

    notifyWarning(message) {
      this.$q.notify({
        type: 'warning',
        message
      });
    },

    notifyInfo(message) {
      this.$q.notify({
        type: 'info',
        message
      });
    },

    validate(fields) {
      let validationFailure = false;

      fields.forEach((field) => {
        const $field = get(this.$v, field);
        if ($field.$invalid) {
          $field.$touch();
          validationFailure = true;
        }
      });

      if (validationFailure) {
        this.notifyNegative('Form has some invalid fields');
        throw new Error('Invalid form');
      }
    },

    reset(fields) {
      fields.forEach((field) => {
        const $field = get(this.$v, field);
        if ($field.$invalid) {
          $field.$reset();
        }
      });
    },

    delayTouch
  }
};
