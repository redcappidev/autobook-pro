import { email, required } from 'vuelidate/lib/validators';
import billingAddressValidator from './billing-address';
import creditCardValidator from './credit-card';

export default {
  shipper: {
    firstName: { required },
    lastName: { required },
    phone: { required },
    email: { email, required },
    address: { required },
    city: { required },
    state: { required },
    zipcode: {
      required,
      valid: (value) => /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(value)
    }
  },
  origin: {
    name: { required },
    phone: { required },
    address: { required }
  },
  destination: {
    name: { required },
    phone: { required },
    address: { required }
  },
  terms: {
    accepted: {
      checked: (value) => value === true
    },
    eName: { required },
    eSign: { required }
  },
  billingAddress: billingAddressValidator,
  creditCard: creditCardValidator
};
