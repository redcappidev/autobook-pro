import path from 'path';
import { Model } from 'objection';
import { Table } from '@server/db/common';
import { getDateStringFromDateObject } from '@server/lib/date-format';
import BaseModel from './base';
import jsonSchema from './json-schemas/followup.schema';

class Followup extends BaseModel {
  static get tableName() {
    return Table.FOLLOWUP;
  }

  static get jsonSchema() {
    return jsonSchema;
  }

  static get relationMappings() {
    return {
      type: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, 'followup-type'),
        join: {
          from: `${Table.FOLLOWUP}.typeId`,
          to: `${Table.FOLLOWUP_TYPE}.id`
        }
      },
      quote: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, 'quote'),
        join: {
          from: `${Table.FOLLOWUP}.quoteId`,
          to: `${Table.QUOTE}.id`
        }
      }
    };
  }

  $parseJson(json, opt) {
    const newJson = super.$parseJson(json, opt);

    if (newJson.followupOn && typeof newJson.followupOn !== 'string') {
      newJson.followupOn = getDateStringFromDateObject(newJson.followupOn);
    }

    return newJson;
  }
}

export default Followup;
