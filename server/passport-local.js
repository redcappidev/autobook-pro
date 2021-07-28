import capitalizeString from 'lodash/capitalize';
import AuthHasher from 'passport-local-authenticate';
import { User, Role } from '@server/models';

const errorMessages = {
  invalidCredentials: 'Invalid username or password',
  emailTaken: 'That email is already taken.',
  passwordsDontMatch: "Passwords don't match.",
  invalidResetHash:
    'Invalid username or password reset link. Contact your administrator.',
  noSamePassword: "Old and new password can't be the same",
  invalidRole: 'Invalid role. Contact your administrator'
};

const login = ({ password, existingUser }) => {
  if (!existingUser) {
    throw new Error(errorMessages.invalidCredentials);
  }

  // Get salt and hash and verify user password
  const pwFieldSplit = existingUser.auth0Id.split('|');
  const hashed = {
    salt: pwFieldSplit[1],
    hash: pwFieldSplit[2]
  };

  return new Promise((resolve, reject) => {
    AuthHasher.verify(password, hashed, (err, verified) => {
      if (err) reject(err);
      if (verified) {
        resolve(existingUser);
      } else {
        reject(new Error(errorMessages.invalidCredentials));
      }
    });
  });
};

const signup = ({ lowerCaseEmail, password, existingUser, reqBody }) => {
  // Verify user doesn't already exist
  if (existingUser && existingUser.email === lowerCaseEmail) {
    throw new Error(errorMessages.emailTaken);
  }

  // Verify password and password confirm fields match
  if (password !== reqBody.passwordConfirm) {
    throw new Error(errorMessages.passwordsDontMatch);
  }

  // create the user
  return new Promise((resolve, reject) => {
    AuthHasher.hash(password, async (err, hashed) => {
      if (err) reject(err);
      // .salt and .hash
      const passwordToSave = `localauth|${hashed.salt}|${hashed.hash}`;

      const role = await Role.query().where('name', reqBody.roleName).first();
      if (!role) {
        reject(new Error(errorMessages.invalidRole));
      } else {
        const user = await User.query()
          .insertGraphAndFetch(
            [
              {
                email: lowerCaseEmail,
                auth0Id: passwordToSave,
                firstName: capitalizeString(reqBody.firstName),
                lastName: capitalizeString(reqBody.lastName),
                role: {
                  id: role.id
                }
              }
            ],
            {
              relate: true
            }
          )
          .first();

        resolve(user);
      }
    });
  });
};

export default { login, signup };
