import { required, minLength, maxLength } from 'vuelidate/lib/validators';

export default {
  cardNumber: { required, minLength: minLength(13), maxLength: maxLength(16) },
  exprMonth: { required, minLength: minLength(2), maxLength: maxLength(2) },
  exprYear: { required, minLength: minLength(4), maxLength: maxLength(4) },
  cvv: { required, minLength: minLength(3), maxLength: maxLength(4) }
};
