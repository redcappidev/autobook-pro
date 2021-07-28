import { Table } from '@server/db/common';
import BaseModel from './base';
import jsonSchema from './json-schemas/mileage-pricing.schema';

class MileagePricing extends BaseModel {
  static get tableName() {
    return Table.MILEAGE_PRICING;
  }

  static get jsonSchema() {
    return jsonSchema;
  }
}

export default MileagePricing;
