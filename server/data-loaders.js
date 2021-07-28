import DataLoader from 'dataloader';
import {
  User,
  PricingException,
  VehicleSize,
  Quote,
  Status,
  EmailTemplate,
  SMSTemplate,
  Carrier,
  Driver,
  Dispatch,
  FollowupType,
  Invite,
  Report,
  AccountPhoneNumber
} from '@server/models';

function createLoader(model, opts) {
  const idKey = (opts && opts.idKey) || 'id';

  return new DataLoader(async (keys) => {
    const queryBuilder =
      opts && opts.queryBuilder ? opts.queryBuilder() : model.query();

    const items = await queryBuilder.findByIds(keys);
    return keys.map((key) =>
      items.find((item) => item[idKey].toString() === key.toString())
    );
  });
}

export const createLoaders = () => ({
  user: createLoader(User),
  pricingException: createLoader(PricingException),
  vehicleSize: createLoader(VehicleSize),
  lead: createLoader(Quote),
  quote: createLoader(Quote, {
    queryBuilder: () =>
      Quote.query().where((builder) =>
        builder.where('isOrder', false).orWhereNull('isOrder')
      )
  }),
  order: createLoader(Quote, {
    queryBuilder: () => Quote.query().where('isOrder', true)
  }),
  status: createLoader(Status),
  emailTemplate: createLoader(EmailTemplate),
  smsTemplate: createLoader(SMSTemplate),
  carrier: createLoader(Carrier),
  driver: createLoader(Driver),
  dispatch: createLoader(Dispatch),
  followupType: createLoader(FollowupType),
  invite: createLoader(Invite),
  report: createLoader(Report),
  phoneNumber: createLoader(AccountPhoneNumber)
});
