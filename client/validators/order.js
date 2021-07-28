import { email, required, minValue, minLength } from 'vuelidate/lib/validators';

export default {
  shipper: {
    firstName: { required },
    lastName: { required },
    phone: { required },
    email: { email, required }
  },
  origin: {
    name: { required },
    phone: { required },
    address: { required },
    state: { required },
    city: { required },
    zipcode: {
      required,
      valid: (value) => /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(value)
    }
  },
  destination: {
    name: { required },
    phone: { required },
    address: { required },
    state: { required },
    city: { required },
    zipcode: {
      required,
      valid: (value) => /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(value)
    }
  },
  vehicles: {
    required,
    minLength: minLength(1),
    $each: {
      year: { required },
      make: { required },
      model: { required },
      operable: { required },
      size: {
        id: { required }
      }
    }
  },
  transport: {
    availableDate: { required },
    basePrice: {
      required,
      minValue: minValue(1)
    },
    deposit: {
      required,
      minValue: minValue(1)
    }
  }
};
