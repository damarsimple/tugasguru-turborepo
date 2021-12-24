import { fieldAuthorizePlugin, makeSchema } from 'nexus'
import { join } from 'path'
import * as ModelTypes from "./models"
import * as MutationTypes from "./mutation"
import * as QueryTypes from "./query"
import { copyFile } from "fs";

const typegen = join(__dirname, '../', 'nexus-typegen.ts');

export const schema = makeSchema({
  types: { ...ModelTypes, ...MutationTypes, ...QueryTypes }
  ,
  outputs: {
    typegen, // 2
    schema: join(__dirname, '../', 'schema.graphql'), // 3
  },
  contextType: {
    module: join(__dirname, '../api', 'context.ts'),
    export: "Context"
  },

  plugins: [fieldAuthorizePlugin()]
})

// copy schema to global types packages

const tsTypesPath = join(__dirname, '../../packages/ts-types', 'nexus-typegen.ts')

// File destination.txt will be created or overwritten by default.
copyFile(typegen, tsTypesPath, (err) => {
  if (err) throw err;
  console.log('source.txt was copied to destination.txt');
});