import AWS from 'aws-sdk';

export default (endpoint, connectionId, data) => {
  const client = new AWS.ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint
  });

  return client
    .postToConnection({
      ConnectionId: connectionId,
      Data: data
    })
    .promise();
};
