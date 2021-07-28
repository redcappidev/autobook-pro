import { AuthenticationError } from 'apollo-server';
import { InsufficientPermissionError } from '@server/graphql/__customErrors';
import { ROLE_NAMES } from '@server/constants';

function isLoggedIn({ user }) {
  if (!user) throw new AuthenticationError('Must authenticate');
  return user;
}

export const directiveTypeDefs = {
  isAuthenticated: 'directive @isAuthenticated on FIELD_DEFINITION',
  hasRole: 'directive @hasRole(role: ROLE!) on FIELD_DEFINITION',
  hasOneOfRoles:
    'directive @hasOneOfRoles(roles: [ROLE!]!) on FIELD_DEFINITION',
  hasPermissions:
    'directive @hasPermissions(permissions: [String!]!) on FIELD_DEFINITION',
  hasOneOfPermissions:
      'directive @hasOneOfPermissions(permissions: [String!]!) on FIELD_DEFINITION'
};

export const directiveResolvers = {
  isAuthenticated: (next, source, args, ctx) => {
    isLoggedIn(ctx);
    return next();
  },
  hasRole: (next, source, { role: requiredRoleName }, ctx) => {
    const user = isLoggedIn(ctx);

    if (user.role.name === requiredRoleName) {
      return next();
    }

    throw new InsufficientPermissionError('Not allowed');
  },
  hasOneOfRoles: (next, source, { roles }, ctx) => {
    const user = isLoggedIn(ctx);

    if (roles.includes(user.role.name)) {
      return next();
    }

    throw new InsufficientPermissionError('Not allowed');
  },
  hasPermissions: (next, source, { permissions: requiredPermissions }, ctx) => {
    const user = isLoggedIn(ctx);

    if (user.role.name === ROLE_NAMES.SUPERADMIN) return next();

    const userPermissions = (user.permissions || '').split(',');
    const missingPermission = requiredPermissions.find(
      (permission) => !userPermissions.includes(permission)
    );

    if (!missingPermission) {
      return next();
    }

    throw new InsufficientPermissionError(
      `Not allowed. ${missingPermission} permission is required`
    );
  },
  hasOneOfPermissions: (next, source, { permissions: requiredPermissions }, ctx) => {
    const user = isLoggedIn(ctx);

    if (user.role.name === ROLE_NAMES.SUPERADMIN) return next();

    if (requiredPermissions.length === 0) return next();

    const userPermissions = (user.permissions || '').split(',');
    const foundPermission = requiredPermissions.find(
      (permission) => userPermissions.includes(permission)
    );

    if (foundPermission) {
      return next();
    }

    throw new InsufficientPermissionError(
      `Not allowed. One of ${requiredPermissions} permission(s) is required`
    );
  }
};
