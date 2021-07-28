import { Status, Quote, EmailTemplate } from '@server/models';
import { Sendgrid } from '@server/third-party';
import {
  QUOTE_ENGAGEMENT_EMAIL_OPEN,
  QUOTE_ENGAGEMENT_EMAIL_CLICK,
  ORDER_LINK_TYPES
} from '@server/constants';
import config from '@server/config';
import * as eventService from './event-service';
import * as orderLinkService from './order-link-service';
import * as placeholderResolverService from './placeholder-resolver-service';

export const createEmailTemplate = (data) =>
  EmailTemplate.query()
    .insert(data)
    .returning('*');

export const updateEmailTemplate = async (templateId, input) => {
  const template = await EmailTemplate.query()
    .updateAndFetchById(
      templateId,
      input
    );

  return template;
};

export const deleteEmailTemplate = async (templateId) => {
  const result = await EmailTemplate.query().deleteById(templateId);
  return result;
};

export const inflateTemplate = async (user, quote, templateId) => {
  const emailTemplate = await EmailTemplate.query().findById(templateId);
  if (!emailTemplate) return null;

  let {
    emailSubject,
    emailFrom,
    emailFromName,
    replyTo,
    emailBcc,
    htmlBody
  } = emailTemplate;

  emailSubject = await placeholderResolverService.resolve(user, quote, emailSubject);
  emailFromName = await placeholderResolverService.resolve(user, quote, emailFromName);
  emailFrom = await placeholderResolverService.resolve(user, quote, emailFrom);
  replyTo = await placeholderResolverService.resolve(user, quote, replyTo);
  emailBcc = await placeholderResolverService.resolve(user, quote, emailBcc);
  htmlBody = await placeholderResolverService.resolve(user, quote, htmlBody);

  return {
    emailFrom,
    emailFromName,
    emailSubject,
    replyTo,
    emailBcc,
    htmlBody
  };
};

export const sendEmailToQuote = async (user, quote, templateId) => {
  const data = await inflateTemplate(user, quote, templateId);
  if (!data) return false;

  const emailData = {
    to: quote.shipper.email,
    from: data.emailFrom,
    subject: data.emailSubject,
    bcc: data.emailBcc,
    cc: data.replyTo,
    html: data.htmlBody,
    custom_args: {
      userId: user.id,
      quoteId: quote.id,
      templateId
    }
  };
  await Sendgrid.sendMail(emailData);

  return true;
};

export const sendTermsAndConditionsEmail = async (user, order) => {
  const orderLink = await orderLinkService.createOrderLink(order.id, ORDER_LINK_TYPES.TERMS);
  const link = `${config.baseUrl}/terms-and-conditions/${orderLink.encryption}`;

  const emailData = {
    to: order.shipper.email,
    from: user.email,
    subject: 'Route Runners Terms and Conditions',
    html: `
      <p>Please click the link below to review our terms and conditions. You will be brought to a secure web portal to protect your data. Please contact us if you have any questions. Thank you. 888-424-4420</p>
      <a href="${link}" target="_blank">Continue to Route Runners terms and conditions</a>
    `,
    custom_args: {
      userId: user.id,
      quoteId: order.id
    }
  };
  await Sendgrid.sendMail(emailData);

  return true;
};

export const sendBillingInfoInputEmail = async (user, order) => {
  const orderLink = await orderLinkService.createOrderLink(order.id, ORDER_LINK_TYPES.BILLING);
  const link = `${config.baseUrl}/billing-information/${orderLink.encryption}`;

  const emailData = {
    to: order.shipper.email,
    from: user.email,
    subject: 'Route Runners Billing Information',
    html: `
      <p>Please click the link below to input your billing information. You will be brought to a secure web portal to protect your data. Please contact us if you have any questions. Thank you. 888-424-4420</p>
      <a href="${link}" target="_blank">Continue to Route Runners terms and conditions</a>
    `,
    custom_args: {
      userId: user.id,
      quoteId: order.id
    }
  };
  await Sendgrid.sendMail(emailData);

  return true;
};

export const handleTrackEmailEngagement = async (event) => {
  if (!event.quoteId || !event.templateId) return;

  if (event.event === 'open' || event.event === 'click') {
    const emailTemplate = await EmailTemplate.query().findById(event.templateId);

    let statusId = null;
    if (event.event === 'open' && emailTemplate.statusOnOpen) statusId = emailTemplate.statusOnOpen;
    if (event.event === 'click' && emailTemplate.statusOnClick) statusId = emailTemplate.statusOnClick;

    const quotePatchData = {};

    if (statusId) {
      const status = await Status.query().findById(statusId);

      if (status.parentId) {
        quotePatchData.parentStatusId = status.parentId;
        quotePatchData.childStatusId = status.id;
      } else {
        quotePatchData.parentStatusId = status.id;
      }
    }

    const engagement = event.event === 'open' ? QUOTE_ENGAGEMENT_EMAIL_OPEN : QUOTE_ENGAGEMENT_EMAIL_CLICK;
    const quote = await Quote.query().findById(event.quoteId);
    if (!quote.engagements || !quote.engagements.includes(engagement)) {
      quotePatchData.engagements = (quote.engagements || []).concat(engagement);
    }

    if (Object.keys(quotePatchData).length > 0) {
      await Quote.query()
        .findById(event.quoteId)
        .patch(quotePatchData);
    }
  }

  await eventService.logEvent(eventService.EVENT_TYPES.trackEmail, event);
};

export const sendInvitationEmail = async (user, email, roleName, encryption) => {
  const emailData = {
    to: email,
    from: user.email,
    subject: "You're invited to Autobook Pro!",
    html: `
      ${user.firstName} ${user.lastName} (Autobook Pro ${user.role.name}) invited you to Autobook Pro as ${roleName}!
      <a href="${config.baseUrl}/invitation/${encryption}" target="_blank">Accept Invitation</a>
    `
  };
  await Sendgrid.sendMail(emailData);
};
