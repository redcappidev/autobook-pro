import { Table } from '@server/db/common';
import BaseModel from './base';
import jsonSchema from './json-schemas/us-city.schema';

class USCity extends BaseModel {
  static get tableName() {
    return Table.US_CITIES;
  }

  static get jsonSchema() {
    return jsonSchema;
  }
}

export default USCity;
