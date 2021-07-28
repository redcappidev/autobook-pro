import capitalizeString from 'lodash/capitalize';
import { mapSchema, getDirectives, MapperKind } from '@graphql-tools/utils';
import { defaultFieldResolver } from 'graphql';
import { NotFoundError } from '@server/graphql/__customErrors';

function resourcePresentDirective(directiveName) {
  return {
    resourcePresentDirectiveTypeDefs: `directive @${directiveName}(name: String, key: String = "id", items: [Resource]) on FIELD_DEFINITION`,
    resourcePresentDirectiveTransformer: (schema) =>
      mapSchema(schema, {
        [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
          const directives = getDirectives(schema, fieldConfig);
          const directiveArgumentMap = directives[directiveName];

          if (directiveArgumentMap) {
            const { name, key, items } = directiveArgumentMap;
            const { resolve = defaultFieldResolver } = fieldConfig;

            // eslint-disable-next-line no-param-reassign
            fieldConfig.resolve = async (source, args, context, info) => {
              if (name && context.loaders[name] && args[key]) {
                const resource = await context.loaders[name].load(args[key]);
                if (!resource) {
                  throw new NotFoundError(
                    `The ${capitalizeString(name)} does not exist`
                  );
                }
              }

              if (items && items.length > 0) {
                const promises = items
                  .filter(
                    (item) =>
                      context.loaders[item.name] && args[item.key || 'id']
                  )
                  .map(async (item) => {
                    const data = await context.loaders[item.name].load(
                      args[item.key || 'id']
                    );
                    return {
                      name: item.name,
                      data
                    };
                  });

                const resources = await Promise.all(promises);
                const resource = resources.find((r) => !r.data);
                if (resource) {
                  throw new NotFoundError(
                    `The ${resource.name} does not exist`
                  );
                }
              }

              return resolve(source, args, context, info);
            };
          }
        }
      })
  };
}

export default resourcePresentDirective;
