import { Table } from '@server/db/common';
import BaseModel from './base';
import jsonSchema from './json-schemas/pricing-exception.schema';

class PricingException extends BaseModel {
  static get tableName() {
    return Table.PRICING_EXCEPTION;
  }

  static get jsonSchema() {
    return jsonSchema;
  }
}

export default PricingException;
