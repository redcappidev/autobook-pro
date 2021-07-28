import { Quote, Notification, Status } from '@server/models';
import { NOTIFICATION_TYPE_POSITIVE, NOTIFICATION_ACTION_VIEW_QUOTE } from '@server/constants';
import * as websocketService from './websocket-service';
import * as emailService from './email-service';
import * as smsService from './sms-service';

export const notifyQuoteEmailEvent = async (event) => {
  if (!event.quoteId) return;

  if (event.event === 'open' || event.event === 'click') {
    const quote = await Quote.query().findById(event.quoteId);
    if (!quote.assigneeId) return;

    const notification = {
      type: NOTIFICATION_TYPE_POSITIVE,
      description: `${quote.shipper.firstName} ${quote.shipper.lastName} is looking at the email`,
      actions: [{
        type: NOTIFICATION_ACTION_VIEW_QUOTE,
        quoteId: event.quoteId,
        order: quote.isOrder
      }],
      userId: quote.assigneeId
    };
    await Notification.query().insert(notification);
    await websocketService.pushNotification(quote.assigneeId, notification);
  }
};

export const notifyAssigneeEvent = async (quote) => {
  if (!quote.assigneeId) return;

  const notification = {
    type: NOTIFICATION_TYPE_POSITIVE,
    description: `You're assigned to the quote #${quote.id}`,
    actions: [{
      type: NOTIFICATION_ACTION_VIEW_QUOTE,
      quoteId: quote.id,
      order: quote.isOrder
    }],
    userId: quote.assigneeId
  };
  await Notification.query().insert(notification);
  await websocketService.pushNotification(quote.assigneeId, notification);
};

export const notifyQuoteStatusChange = async (user, quote, options) => {
  if (!options.canSendSMS && !options.canSendEmail) return;

  if (options.parentStatusChange) {
    const parentStatus = await Status.query().findById(quote.parentStatusId);
    if (!parentStatus) {
      return;
    }
    if (options.canSendEmail && parentStatus.emailTemplateId) {
      emailService.sendEmailToQuote(user, quote, parentStatus.emailTemplateId);
    }

    if (options.canSendSMS && parentStatus.smsTemplateId) {
      smsService.sendSMSToQuote(user, quote, parentStatus.smsTemplateId);
    }
  }

  if (options.childStatusChange) {
    const childStatus = await Status.query().findById(quote.childStatusId);
    if (!childStatus) {
      return;
    }

    if (options.canSendEmail && childStatus.emailTemplateId) {
      emailService.sendEmailToQuote(user, quote, childStatus.emailTemplateId);
    }

    if (options.canSendSMS && childStatus.smsTemplateId) {
      smsService.sendSMSToQuote(user, quote, childStatus.smsTemplateId);
    }
  }
};
