import { ApolloServer } from 'apollo-server-express';

import { schema } from '@server/graphql';
import { createLoaders } from '@server/data-loaders';
import { removeUserPermissions } from '@server/lib/permission-helpers';

export function createApolloServer(context = {}, options = {}) {
  const finalContext = {
    loaders: createLoaders(),
    ...context
  };

  if (context.user) {
    let finalUser = context.user;

    if (options.omitPermissions) {
      finalUser = removeUserPermissions(finalUser, options.omitPermissions);
    }

    finalContext.user = finalUser;
  }

  return new ApolloServer({
    schema,
    debug: true,
    context: finalContext
  });
}
