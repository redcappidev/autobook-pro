import { mapSchema, getDirectives, MapperKind } from '@graphql-tools/utils';
import { defaultFieldResolver } from 'graphql';
import getter from '@server/lib/advanced-getter';

function nonNullOptionalInputDirective(directiveName) {
  return {
    nonNullOptionalInputDirectiveTypeDefs: `directive @${directiveName}(paths: [String!]!) on FIELD_DEFINITION`,
    nonNullOptionalInputDirectiveTransformer: (schema) =>
      mapSchema(schema, {
        [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
          const directives = getDirectives(schema, fieldConfig);
          const directiveArgumentMap = directives[directiveName];

          if (directiveArgumentMap) {
            const { paths } = directiveArgumentMap;
            const { resolve = defaultFieldResolver } = fieldConfig;

            // eslint-disable-next-line no-param-reassign
            fieldConfig.resolve = (source, args, context, info) => {
              paths.forEach((path) => {
                if (
                  getter(args, path).some(
                    (d) => d === null || typeof d === 'undefined'
                  )
                ) {
                  throw new Error(`${path} cannot be null`);
                }
              });

              return resolve(source, args, context, info);
            };
          }
        }
      })
  };
}

export default nonNullOptionalInputDirective;
