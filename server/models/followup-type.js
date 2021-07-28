import path from 'path';
import { Model } from 'objection';
import { Table } from '@server/db/common';
import BaseModel from './base';
import jsonSchema from './json-schemas/followup-type.schema';

class FollowupType extends BaseModel {
  static get tableName() {
    return Table.FOLLOWUP_TYPE;
  }

  static get jsonSchema() {
    return jsonSchema;
  }

  static get relationMappings() {
    return {
      smsTemplate: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, 'sms-template'),
        join: {
          from: `${Table.FOLLOWUP_TYPE}.smsTemplateId`,
          to: `${Table.SMS_TEMPLATE}.id`
        }
      },
      followups: {
        relation: Model.HasManyRelation,
        modelClass: path.join(__dirname, 'followup'),
        join: {
          from: `${Table.FOLLOWUP_TYPE}.id`,
          to: `${Table.FOLLOWUP}.typeId`
        }
      }
    };
  }
}

export default FollowupType;
