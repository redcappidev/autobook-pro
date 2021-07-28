import path from 'path';
import { Model } from 'objection';
import { Table } from '@server/db/common';
import BaseModel from './base';
import jsonSchema from './json-schemas/quote-transition.schema';

class QuoteTransition extends BaseModel {
  static get tableName() {
    return Table.QUOTE_TRANSITION;
  }

  static get jsonSchema() {
    return jsonSchema;
  }

  static get relationMappings() {
    return {
      quote: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, 'quote'),
        join: {
          from: `${Table.QUOTE_TRANSITION}.quoteId`,
          to: `${Table.QUOTE}.id`
        }
      }
    };
  }
}

export default QuoteTransition;
