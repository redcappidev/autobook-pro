import aws from 'aws-sdk';
import db from '@server/db';

const codedeploy = new aws.CodeDeploy({ apiVersion: '2014-10-06' });

function makeCodeDeployHandler(name, handlerFn) {
  return async function handler(event) {
    const deploymentId = event.DeploymentId;
    const lifecycleEventHookExecutionId = event.LifecycleEventHookExecutionId;

    const params = {
      deploymentId,
      lifecycleEventHookExecutionId,
      status: 'Succeeded'
    };

    try {
      await handlerFn();
    } catch (e) {
      params.status = 'Failed';
    }

    await codedeploy.putLifecycleEventHookExecutionStatus(params).promise();
  };
}

module.exports.preflight = makeCodeDeployHandler('preflight', () =>
  db.knex.migrate.latest()
);
module.exports.postflight = makeCodeDeployHandler('postflight', () => {});
