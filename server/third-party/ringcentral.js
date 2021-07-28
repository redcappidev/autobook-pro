import RingCentral from '@ringcentral/sdk';
import config from '@server/config';

const rcsdk = new RingCentral({
  server: config.ringcentral.endpoint,
  clientId: config.ringcentral.clientId,
  clientSecret: config.ringcentral.clientSecret
});

const platform = rcsdk.platform();

export const sendSMS = async ({
  from = {},
  toNumber,
  text
}) => {
  if (!from.number) return;

  try {
    await platform.login({
      username: config.ringcentral.username,
      password: config.ringcentral.password,
      extension: from.extension || config.ringcentral.extension
    });

    await platform.post('/restapi/v1.0/account/~/extension/~/sms', {
      from: { phoneNumber: from.number },
      to: [{ phoneNumber: toNumber }],
      text
    });
  } catch (error) {
    console.error('error', error);
  }
};
