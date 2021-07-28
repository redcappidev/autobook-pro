import { Table } from '@server/db/common';
import BaseModel from './base';
import jsonSchema from './json-schemas/enclosed-fee.schema';

class EnclosedFee extends BaseModel {
  static get tableName() {
    return Table.ENCLOSED_FEE;
  }

  static get jsonSchema() {
    return jsonSchema;
  }
}

export default EnclosedFee;
