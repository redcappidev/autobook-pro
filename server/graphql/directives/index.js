import {
  directiveResolvers as authDirectiveResolvers,
  directiveTypeDefs as authDirectiveTypeDefs
} from './auth-directive';
import nonNullOptionalInputDirective from './nonnull-optional-input-directive';
import presentResourceDirective from './present-resource-directive';

const {
  nonNullOptionalInputDirectiveTypeDefs,
  nonNullOptionalInputDirectiveTransformer
} = nonNullOptionalInputDirective('nonNullOptionalInput');

const {
  resourcePresentDirectiveTypeDefs,
  resourcePresentDirectiveTransformer
} = presentResourceDirective('presentResource');

export const directiveTypeDefs = [
  authDirectiveTypeDefs.isAuthenticated,
  authDirectiveTypeDefs.hasRole,
  authDirectiveTypeDefs.hasOneOfRoles,
  authDirectiveTypeDefs.hasPermissions,
  authDirectiveTypeDefs.hasOneOfPermissions,
  nonNullOptionalInputDirectiveTypeDefs,
  resourcePresentDirectiveTypeDefs
];

export const directiveResolvers = {
  ...authDirectiveResolvers
};

export const schemaTransforms = [
  nonNullOptionalInputDirectiveTransformer,
  resourcePresentDirectiveTransformer
];
