// import { RegularExpression } from 'graphql-scalars';

export default {
  // Need to remove the custom scalar type that was defined prior to
  // the recent graphql-scalar version that defines NonEmptyString
  // NonEmptyString: new RegularExpression('NonEmptyString', /^(?!\s*$).+/)
};
