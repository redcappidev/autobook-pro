import log from '@server/lib/log';
import app from '@server/app';

process.on('uncaughtException', (ex) => {
  log.error(ex);
  process.exit(1);
});

const server = app.listen(3000, () => {
  log.info('Server listening on port 3000!');
});

// Handle nodemon shutdown cleanly, otherwise the port might not
// be freed before we start up again.
process.once('SIGUSR2', () => {
  log.warn('Got SIGUSR2, shutting down...');
  server.close(() => {
    log.warn('Server shut down, exiting.');
    process.exit();
  });
});

export default app;
