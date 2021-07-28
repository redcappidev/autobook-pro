import capitalizeString from 'lodash/capitalize';
import passport from 'passport';
import Auth0Strategy from 'passport-auth0';
import { Strategy as LocalStrategy } from 'passport-local';
import wrap from '@server/lib/wrap';
import { User, Role, Invitation } from '@server/models';
import localAuthHelpers from '@server/passport-local';
import config from '@server/config';

export function setupAuth0Passport() {
  const strategy = new Auth0Strategy(
    {
      domain: config.auth0.domain,
      clientID: config.auth0.clientId,
      clientSecret: config.auth0.clientSecret,
      callbackURL: `${config.baseUrl}/login-callback`,
      state: false
    },
    (accessToken, refreshToken, extraParams, profile, done) => {
      done(null, profile);
    }
  );

  passport.use(strategy);

  passport.serializeUser((user, done) => {
    // This is the Auth0 user object, not the db one
    // eslint-disable-next-line no-underscore-dangle
    const auth0Id = user.id || user._json.sub;
    done(null, auth0Id);
  });

  passport.deserializeUser(
    wrap(async (id, done) => {
      // add new cacheable query
      const user = await User.query()
        .findOne({ auth0Id: id })
        .withGraphFetched('role');

      if (user.status === 'DEACTIVATED') {
        done(null, false);
      } else {
        done(null, user || false);
      }
    })
  );

  return {
    loginCallback: [
      passport.authenticate('auth0', { failureRedirect: '/login' }),
      wrap(async (req, res) => {
        // eslint-disable-next-line no-underscore-dangle
        const auth0Id = req.user && (req.user.id || req.user._json.sub);
        if (!auth0Id) {
          throw new Error('Null user in login callback');
        }
        const existingUser = await User.query().findOne({ auth0Id });

        if (!existingUser) {
          const userMetadata =
            // eslint-disable-next-line no-underscore-dangle
            req.user._json['https://autobookpro/user_metadata'] ||
            // eslint-disable-next-line no-underscore-dangle
            req.user._json.user_metadata ||
            {};

          const invitationToken = userMetadata.invitation_token;
          const invitation = await Invitation.query().findOne('encryption', invitationToken);
          if (invitation) {
            const role = await Role.query()
              .where('name', invitation.roleName)
              .first();
            const userData = {
              auth0Id,
              // eslint-disable-next-line no-underscore-dangle
              email: req.user._json.email,
              firstName: capitalizeString(userMetadata.firstName) || '',
              lastName: capitalizeString(userMetadata.lastName) || '',
              role: {
                id: role.id
              },
              permissions: invitation.permissions,
              status: 'ACTIVATED'
            };

            await User.query().insertGraph(userData, { relate: true });

            await invitation.$query().delete();
          }
        }

        res.redirect(req.query.state || '/');
      })
    ]
  };
}

export function setupLocalAuthPassport() {
  const strategy = new LocalStrategy(
    {
      usernameField: 'email',
      passReqToCallback: true
    },
    wrap(async (req, username, password, done) => {
      const lowerCaseEmail = username.toLowerCase();
      const existingUser = await User.query()
        .findOne({ email: lowerCaseEmail })
        .withGraphFetched('role');

      if (req.body.authType && !localAuthHelpers[req.body.authType]) {
        return done(null, false);
      }

      try {
        const user = await localAuthHelpers[req.body.authType]({
          lowerCaseEmail,
          password,
          existingUser,
          reqBody: req.body
        });

        return done(null, user);
      } catch (error) {
        return done(null, false, error.message);
      }
    })
  );

  passport.use(strategy);

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(
    wrap(async (id, done) => {
      const intId = parseInt(id, 10);
      if (Number.isNaN(intId)) {
        done(null, false);
        return;
      }

      const user = await User.query().findById(id).withGraphFetched('role');
      done(null, user || false);
    })
  );

  return {
    loginCallback: [
      passport.authenticate('local'),
      (req, res) => {
        res.redirect(req.body.nextUrl || '/');
      }
    ]
  };
}

export default {
  local: setupLocalAuthPassport,
  auth0: setupAuth0Passport
};
