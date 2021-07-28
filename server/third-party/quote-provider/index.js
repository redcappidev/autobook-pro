import { REFERRER_IRELO, REFERRER_WEBSITE } from '@server/constants/referrers';
import iRelloParser from './irello-parser';
import selfParser from './self-parser';
// import Ajv from 'ajv';
// import schema from '@server/models/json-schemas/quote.schema';

const parsers = {
  [REFERRER_WEBSITE]: selfParser,
  [REFERRER_IRELO]: iRelloParser
};

export default class QuoteProvider {
  constructor(source) {
    this.name = source;
    this.parser = source ? parsers[source] : selfParser;
  }

  parse(rawData) {
    if (this.parser) {
      const result = {
        quote: this.parser(rawData),
        parsed: true,
        error: null
      };

      // const ajv = Ajv({ allErrors: true });
      // const validate = ajv.compile(schema);
      // const valid = validate(result.quote);

      // if (!valid) {
      //   result.parsed = false;
      //   result.error = validate.errors;
      // }

      return result;
    }

    return null;
  }
}
