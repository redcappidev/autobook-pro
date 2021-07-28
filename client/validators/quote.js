import { required, email, minValue, minLength } from 'vuelidate/lib/validators';

export default {
  shipper: {
    firstName: { required },
    phone: { required },
    email: { email }
  },
  origin: {
    state: { required },
    city: { required },
    zipcode: { required }
  },
  destination: {
    state: { required },
    city: { required },
    zipcode: { required }
  },
  vehicles: {
    required,
    minLength: minLength(1),
    $each: {
      year: { required },
      make: { required },
      model: { required },
      operable: { required }
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
