import { Table } from '@server/db/common';
import BaseModel from './base';
import jsonSchema from './json-schemas/fee.schema';

class Fee extends BaseModel {
  static get tableName() {
    return Table.FEE;
  }

  static get jsonSchema() {
    return jsonSchema;
  }
}

export default Fee;
