import { email, required } from 'vuelidate/lib/validators';

export default {
  firstName: { required },
  lastName: { required },
  email: { email, required },
  address: { required },
  state: { required },
  city: { required },
  zipcode: {
    required,
    valid: (value) => /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(value)
  }
};
