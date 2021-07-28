import path from 'path';
import { Model } from 'objection';
import { Table } from '@server/db/common';
import BaseModel from './base';
import jsonSchema from './json-schemas/note.schema';

class Note extends BaseModel {
  static get tableName() {
    return Table.NOTE;
  }

  static get jsonSchema() {
    return jsonSchema;
  }

  static get relationMappings() {
    return {
      addedBy: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, 'user'),
        join: {
          from: `${Table.NOTE}.userId`,
          to: `${Table.USER}.id`
        }
      },
      assignees: {
        relation: Model.ManyToManyRelation,
        modelClass: path.join(__dirname, 'user'),
        join: {
          from: `${Table.NOTE}.id`,
          through: {
            from: `${Table.NOTE_ASSIGNMENT}.noteId`,
            to: `${Table.NOTE_ASSIGNMENT}.assigneeId`,
            extra: ['viewed', 'viewedAt']
          },
          to: `${Table.USER}.id`
        }
      }
    };
  }
}

export default Note;
