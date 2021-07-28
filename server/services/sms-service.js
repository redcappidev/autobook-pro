import { htmlToText } from 'html-to-text';
import { SMSTemplate, User } from '@server/models';
import { RingCentral } from '@server/third-party';
import * as placeholderResolverService from './placeholder-resolver-service';

export const inflateTemplate = async (user, quote, templateId) => {
  const smsTemplate = await SMSTemplate.query().findById(templateId);
  if (!smsTemplate) return null;

  return placeholderResolverService.resolve(user, quote, smsTemplate.script);
};

export const sendSMSToQuote = async (user, quote, templateId) => {
  const phoneNumber = await User
     .relatedQuery('phoneNumber')
     .for(user.id)
     .first();

  const text = await inflateTemplate(user, quote, templateId);
  const cleanText = htmlToText(text, { wordwrap: 130 });
  await RingCentral.sendSMS({
    from: phoneNumber,
    toNumber: quote.shipper.phone,
    text: cleanText
  });
};
