import { fieldAuthorizePlugin, makeSchema } from 'nexus'
import { join } from 'path'
import * as ModelTypes from "./models"
import * as MutationTypes from "./mutation"
import * as QueryTypes from "./query"
import { copyFile, readFileSync, writeFileSync } from "fs";

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

const tsTypesPath = join(__dirname, '../../../packages/ts-types', 'nexus-typegen.ts')

const data = readFileSync(typegen, 'utf-8');

const newValue = data
  .replace(new RegExp(`import type { Context } from "./api/context"`), '')
  .replace(new RegExp(`context: Context;`), '');



writeFileSync(tsTypesPath, newValue, 'utf-8');


console.log('typegen copied to global ts-types packages');