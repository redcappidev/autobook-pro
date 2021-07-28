import { makeExecutableSchema } from '@graphql-tools/schema';
import {
  typeDefs as scalarTypeDefs,
  resolvers as scalarResolvers
} from 'graphql-scalars';
import typeDefs from './__typeDefs';
import resolvers from './__resolvers';
import {
  directiveTypeDefs,
  directiveResolvers,
  schemaTransforms
} from './directives';

export const schema = makeExecutableSchema({
  typeDefs: [...directiveTypeDefs, ...scalarTypeDefs, typeDefs],
  resolvers: { ...scalarResolvers, ...resolvers },
  directiveResolvers,
  schemaTransforms
});
