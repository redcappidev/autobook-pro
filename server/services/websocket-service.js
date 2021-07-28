import { Connection } from '@server/models';
import { AWS } from '@server/third-party';
import config from '@server/config';

export const postToWebsocketClient = async (userId, data) => {
  const connection = await Connection.query().findOne({ userId });
  if (connection.connectionId) {
    await AWS.ws.postToClient(`https://${config.aws.websocketDomain}/${config.aws.stage}`, connection.connectionId, data);
  }
};

export const pushNotification = async (userId, data) => {
  if (!config.aws.websocketDomain) return;

  await postToWebsocketClient(
    userId,
    JSON.stringify({
      type: 'notification',
      data
    })
  );
};
