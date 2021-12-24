import { fieldAuthorizePlugin, makeSchema } from 'nexus'
import { join } from 'path'
import * as ModelTypes from "./models"
import * as MutationTypes from "./mutation"
import * as QueryTypes from "./query"

export const schema = makeSchema({
  types: { ...ModelTypes, ...MutationTypes, ...QueryTypes }
  ,
  outputs: {
    typegen: join(__dirname, '../', 'nexus-typegen.ts'), // 2
    schema: join(__dirname, '../', 'schema.graphql'), // 3
  },
  contextType: {
    module: join(__dirname, '../api', 'context.ts'),
    export: "Context"
  },

  plugins: [fieldAuthorizePlugin()]
})