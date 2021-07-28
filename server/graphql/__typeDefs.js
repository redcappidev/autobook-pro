import fs from 'fs';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { print } from 'graphql';
import config from '@server/config';

const typesArray = loadFilesSync(__dirname, { extensions: ['graphql'] });
const typeDefs = mergeTypeDefs(typesArray, { all: true });

if (config.NODE_ENV !== 'production') {
  const printedTypeDefs = print(typeDefs);
  fs.writeFileSync('joined.graphql', printedTypeDefs);
}

export default typeDefs;
