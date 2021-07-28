import express from 'express';
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';
import awsServerlessExpressMiddleware from 'aws-serverless-express/middleware';
import passport from 'passport';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import requestIp from 'request-ip';

import renderIndex from '@server/middleware/render-index';
import passportSetup from '@server/passport';
import { createLoaders } from '@server/data-loaders';
import { schema } from '@server/graphql';
import { backgroundJobService } from '@server/services';
import db from '@server/db';
import restApiRouter from '@server/restful';
import config from '@server/config';

db.enableTracing();

const DEBUG = config.NODE_ENV !== 'production';

const app = express();
app.use(cors({
  origin: ['http://localhost:8080', 'https://www.routerunnersautotransport.com']
}));
if (!DEBUG) {
  app.set('trust proxy', 1);
  app.use(awsServerlessExpressMiddleware.eventContext());
}

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(
  cookieSession({
    name: 'session',
    keys: [config.sessionSecret],
    httpOnly: true,
    secure: !DEBUG,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    sameSite: 'lax'
  })
);

/**
 * Set up passport according to the given strategy
 */
app.use(passport.initialize());
app.use(passport.session());

app.get('/logout-callback', (req, res) => {
  req.logOut();
  res.redirect('/');
});

const loginCallbacks = passportSetup[
  process.env.PASSPORT_STRATEGY || global.PASSPORT_STRATEGY || 'auth0'
](app);

if (loginCallbacks) {
  app.get('/login-callback', ...loginCallbacks.loginCallback);
  app.post('/login-callback', ...loginCallbacks.loginCallback);
}

/**
 * Load the GraphQL schema and set up an apollo server
 */
const server = new ApolloServer({
  schema,
  debug: DEBUG,
  context: ({ req }) => ({
    loaders: createLoaders(),
    user: req.user,
    clientIp: requestIp.getClientIp(req)
  }),
  formatError: (error) => error,
  engine: {
    reportSchema: true
  }
});

server.applyMiddleware({
  app,
  path: '/graphql'
});

/**
 * Set up a router for restful apis.
 */
app.use('/rest-api', restApiRouter);

app.post('/sendgrid-webhook', async (req, res) => {
  await backgroundJobService.trackEmailEngagement(req.body);
  res.json();
});

/**
 * Each requests that are not any GraphQL request and API endpoints, ends up here.
 * It generates a HTML text and send that back to the client so that the client browser
 * can render the HTML.
 */
const checkIfAuthRequired = (path) => {
  if (['/'].includes(path)) return false;
  if (path.includes('/book-order')) return false;
  if (path.includes('/terms-and-conditions')) return false;
  if (path.includes('/billing-information')) return false;
  if (path.includes('/invitation')) return false;
  return true;
};

app.use(async (req, res, next) => {
  if (checkIfAuthRequired(req.path) && !req.isAuthenticated()) {
    res.redirect(302, '/');
    return;
  }

  res.type('html');

  try {
    res.send(await renderIndex(req));
  } catch (e) {
    next(e);
  }
});

export default app;
