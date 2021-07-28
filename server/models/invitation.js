import { Table } from '@server/db/common';
import BaseModel from './base';
import jsonSchema from './json-schemas/invitation.schema';

class Invitation extends BaseModel {
  static get tableName() {
    return Table.INVITATION;
  }

  static get jsonSchema() {
    return jsonSchema;
  }
}

export default Invitation;
