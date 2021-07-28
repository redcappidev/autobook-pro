import { EmailTemplate } from '@server/models';
import * as emailService from '@server/services/email-service';
import { referrers } from '@server/constants/referrers';

export default {
  EmailTemplate: {
    referrers: (template) => {
      if (!template.referrers) return null;
      return template.referrers.map((referrer) => referrers.find((r) => r.value === referrer));
    },
    statusOnOpen: (template, _, { loaders }) => {
      if (!template.statusOnOpen) return null;
      return loaders.status.load(template.statusOnOpen);
    },
    statusOnClick: (template, _, { loaders }) => {
      if (!template.statusOnClick) return null;
      return loaders.status.load(template.statusOnClick);
    }
  },
  Query: {
    emailTemplate: (_, { id }, { loaders }) => loaders.emailTemplate.load(id),
    emailTemplates: () => EmailTemplate.query().orderBy('createdAt', 'DESC')
  },
  Mutation: {
    createEmailTemplate: (_, { input }) =>
      emailService.createEmailTemplate(input),
    updateEmailTemplate: (_, { templateId, input }) =>
      emailService.updateEmailTemplate(templateId, input),
    deleteEmailTemplate: (_, { templateId }) =>
      emailService.deleteEmailTemplate(templateId)
  }
};
