import { Connection } from '@server/models';

export async function main(event, context, cb) {
  const { body: userData } = JSON.parse(event.body);

  if (!userData) {
    cb(null, {
      statusCode: 401,
      body: 'Invalid request'
    });
  } else {
    try {
      const userId = parseInt(userData.id, 10);
      const { connectionId } = event.requestContext;
      const connection = await Connection.query().findOne({ userId });

      if (connection) {
        if (connection.connectionId !== connectionId) {
          await connection.$query().patch({ connectionId });
        }
      } else {
        await Connection.query().insert({ userId, connectionId });
      }

      cb(null, {
        statusCode: 200,
        body: 'The user gets connected'
      });
    } catch (error) {
      console.log('connect user handler error', error);
      cb(null, {
        statusCode: 402,
        body: 'Something went wrong'
      });
    }
  }
}
