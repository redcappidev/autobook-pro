import runPromiseSerial from '@server/lib/promise-serial';
import * as emailService from '@server/services/email-service';
import * as notificationService from '@server/services/notification-service';

export default async function trackEmailEngagement(job) {
  const events = job.config;
  const promiseSerial = events
    .map((event) => async () => {
      await emailService.handleTrackEmailEngagement(event);
      await notificationService.notifyQuoteEmailEvent(event);
    });
  await runPromiseSerial(promiseSerial);
  return { message: 'success' };
}
