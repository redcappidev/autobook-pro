import { AWS } from '@server/third-party';
import { BackgroundJob } from '@server/models';
import config from '@server/config';
import { JOB_STATUS } from '@server/constants';
import log from '@server/lib/log';

import trackEmailEngagement from './track-email-engagement';

function wrapJob(jobFn) {
  return async (job) => {
    try {
      await BackgroundJob.transaction(async (trx) => {
        const j = await BackgroundJob.query(trx).findById(job.id);
        if (j.status !== JOB_STATUS.PENDING) {
          throw Error(`Attempting to start a job with status ${j.status}`);
        }
        await j.$query(trx).patch({
          progress: 0,
          status: JOB_STATUS.RUNNING
        });
      });

      const result = await jobFn(job);

      await BackgroundJob.query().findById(job.id).patch({
        progress: 100,
        status: JOB_STATUS.DONE,
        result
      });
    } catch (error) {
      await BackgroundJob.query().findById(job.id).patch({
        status: JOB_STATUS.FAILED,
        result: {
          message: error.message
        }
      });
      throw error;
    }
  };
}

export const JOB_NAME = {
  TRACK_EMAIL_ENGAGEMENT: 'TRACK_EMAIL_ENGAGEMENT'
};

export const WORKER_MAP = {
  [JOB_NAME.TRACK_EMAIL_ENGAGEMENT]: wrapJob(trackEmailEngagement)
};

async function invokeLambdaWorker(job) {
  const client = AWS.lambda.getClient();

  const res = await client.invoke({
    FunctionName: config.aws.jobLambdaWorkerName,
    InvocationType: 'Event',
    Payload: JSON.stringify({ jobId: job.id })
  }).promise();

  log.debug({
    msg: 'Lambda worker invocation response',
    response: res.response
  });
}

export async function dispatchJob(job) {
  try {
    await invokeLambdaWorker(job);
  } catch (error) {
    log.error(error);
    await BackgroundJob.query().findById(job.id).patch({
      status: JOB_STATUS.FAILED,
      result: {
        message: error.message
      }
    });
    throw error;
  }
}
