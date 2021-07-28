import AWS from 'aws-sdk';

let lambdaClient;
export function getClient() {
  if (!lambdaClient) {
    lambdaClient = new AWS.Lambda();
  }
  return lambdaClient;
}
