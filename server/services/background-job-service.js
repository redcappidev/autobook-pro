import { BackgroundJob } from '@server/models';
import { JOB_NAME, dispatchJob } from '@server/jobs';

export const trackEmailEngagement = async (trackings) => {
  const job = await BackgroundJob.query().insert({
    name: JOB_NAME.TRACK_EMAIL_ENGAGEMENT,
    config: trackings
  });

  await dispatchJob(job);
};
