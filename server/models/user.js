import path from 'path';
import { Model } from 'objection';
import { Table } from '@server/db/common';
import BaseModel from './base';
import jsonSchema from './json-schemas/user.schema';

class User extends BaseModel {
  static get tableName() {
    return Table.USER;
  }

  static get jsonSchema() {
    return jsonSchema;
  }

  static get relationMappings() {
    return {
      role: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, 'role'),
        join: {
          from: `${Table.USER}.roleId`,
          to: `${Table.ROLE}.id`
        }
      },
      phoneNumber: {
        relation: Model.HasOneRelation,
        modelClass: path.join(__dirname, 'phone-number'),
        join: {
          from: `${Table.USER}.id`,
          to: `${Table.PHONE_NUMBER}.userId`
        }
      },
      assignedQuotes: {
        relation: Model.HasManyRelation,
        modelClass: path.join(__dirname, 'quote'),
        join: {
          from: `${Table.USER}.id`,
          to: `${Table.QUOTE}.assigneeId`
        }
      },
      assignedQuoteNotes: {
        relation: Model.ManyToManyRelation,
        modelClass: path.join(__dirname, 'note'),
        join: {
          from: `${Table.USER}.id`,
          through: {
            from: `${Table.NOTE_ASSIGNMENT}.assigneeId`,
            to: `${Table.NOTE_ASSIGNMENT}.noteId`,
            extra: ['viewed', 'viewedAt']
          },
          to: `${Table.NOTE}.id`
        }
      },
      notifications: {
        relation: Model.HasManyRelation,
        modelClass: path.join(__dirname, 'notification'),
        join: {
          from: `${Table.USER}.id`,
          to: `${Table.NOTIFICATION}.userId`
        }
      }
    };
  }
}

export default User;
