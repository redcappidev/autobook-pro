export function connect(event, context, cb) {
  cb(null, {
    statusCode: 200,
    body: 'Connected.'
  });
}

export function disconnect(event, context, cb) {
  cb(null, {
    statusCode: 200,
    body: 'Disconnected.'
  });
}

export async function defaultHandler(event, context, cb) {
  cb(null, {
    statusCode: 200,
    body: 'Sent'
  });
}
