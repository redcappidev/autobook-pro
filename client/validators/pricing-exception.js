import { required } from 'vuelidate/lib/validators';

export default {
  originState: { required },
  originCity: { required },
  destState: { required },
  destCity: { required }
};
