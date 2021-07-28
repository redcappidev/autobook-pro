import log from '@server/lib/log';
import { BackgroundJob } from '@server/models';
import { WORKER_MAP } from '@server/jobs';

exports.handler = async (event) => {
  log.debug({ msg: 'Received event', event });

  if (!event.jobId) {
    log.error({ msg: 'Missing jobId in event', event });
    return;
  }

  const job = await BackgroundJob.query().findById(event.jobId);
  try {
    const workerFn = WORKER_MAP[job.name];
    if (!workerFn) {
      log.error({
        msg: 'Could not find a worker for job',
        job,
        workers: Object.keys(WORKER_MAP)
      });
      return;
    }

    await workerFn(job);
  } catch (error) {
    log.error({
      msg: 'Caught exception while processing job', job, error
    });
  }
};
