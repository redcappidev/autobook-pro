import { ForbiddenError } from 'apollo-server';
import { Status } from '@server/models';

export default {
  Status: {
    parent: (status, _, { loaders }) => {
      if (status.parentId) {
        return loaders.status.load(status.parentId);
      }

      return null;
    },
    children: (status) => Status.relatedQuery('children').for(status.id),
    childrenCount: async (status) => {
      const data = await Status.relatedQuery('children').for(status.id).count();
      return data[0].count;
    },
    emailTemplate: (status, _, { loaders }) => {
      if (status.emailTemplateId) {
        return loaders.emailTemplate.load(status.emailTemplateId);
      }

      return null;
    },
    smsTemplate: (status, _, { loaders }) => {
      if (status.smsTemplateId) {
        return loaders.smsTemplate.load(status.smsTemplateId);
      }

      return null;
    }
  },
  Query: {
    status: (_, { id }, { loaders }) => loaders.status.load(id),
    parentStatuses: async (_, { type }) => {
      if (type === 'ALL') {
        const data = await Status.query()
          .whereNull('parentId')
          .orderBy('createdAt', 'DESC');
        return data;
      }

      return Status.query()
        .where('type', type)
        .whereNull('parentId')
        .orderBy('createdAt', 'DESC');
    },
    childStatuses: async (_, { parentId }) =>
      Status.relatedQuery('children').for(parentId)
  },
  Mutation: {
    createStatus: async (_, { input }) => {
      const dataGraph = {
        name: input.name,
        type: input.type
      };

      let hasRelation = false;

      if (input.parentId) {
        dataGraph.parent = { id: input.parentId };
        hasRelation = true;
      }

      if (input.emailTemplateId) {
        dataGraph.notificationEmailTemplate = {
          id: input.emailTemplateId
        };
        hasRelation = true;
      }

      if (input.smsTemplateId) {
        dataGraph.notificationSMSTemplate = {
          id: input.smsTemplateId
        };
        hasRelation = true;
      }

      if (hasRelation) {
        const data = await Status.query().insertGraphAndFetch([dataGraph], {
          relate: true
        });
        return data[0];
      }

      return Status.query().insert(dataGraph).returning('*');
    },
    updateStatus: (_, { id, input }) => {
      const graph = { id: parseInt(id, 10) };

      if (input.name) {
        graph.name = input.name;
      }
      if (input.parentId) {
        graph.parent = { id: input.parentId };
      }
      if (input.emailTemplateId) {
        graph.notificationEmailTemplate = { id: input.emailTemplateId };
      }
      if (input.emailTemplateId === null) {
        graph.notificationEmailTemplate = null;
      }
      if (input.smsTemplateId) {
        graph.notificationSMSTemplate = { id: input.smsTemplateId };
      }
      if (input.smsTemplateId === null) {
        graph.notificationSMSTemplate = null;
      }

      return Status.query().upsertGraphAndFetch(graph, {
        relate: true,
        unrelate: true
      });
    },
    deleteStatus: async (_, { id }) => {
      const data = await Status.relatedQuery('children').for(id).count();

      if (data[0].count > 0) {
        throw new ForbiddenError(
          'A parent status with children can not be deleted'
        );
      }

      const theDeleted = await Status.query()
        .delete()
        .findById(id)
        .returning('*');
      return theDeleted;
    }
  }
};
