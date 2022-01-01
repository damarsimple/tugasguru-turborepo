import { ApolloServer } from "apollo-server-express";
import { schema } from "../schema/schema";
import { context, prisma } from "../api/context";
import pino from "pino";
import { logRequestDB } from "../logging";
import { verifyJWT } from "../api/jwt";
import { User } from "@prisma/client";
import { graphqlUploadExpress } from "graphql-upload";
import express from "express";

const dest = pino.destination({
  sync: false,
});
const logger = pino(dest);

const server = new ApolloServer({
  //@ts-ignore
  schema,
  context: async ({ req }) => {
    // Get the user token from the headers.
    const token = req.headers.authorization || "";

    if (!token) return context;

    // Try to retrieve a user with the token
    const user = (await verifyJWT(token)) as User | undefined;

    if (user) {
      // console.log(`logged ${user?.name}`);
    } else {
      console.log(`not logged ${token}`);
    }

    return {
      user,
      isLogged: !!user,
      isAdmin: user?.isAdmin || false,
      ...context,
    };
  },
  plugins: [
    {
      async requestDidStart(ctx) {
        const start = Date.now();
        const { operationName, query, variables, http } = ctx.request;
        const data = {
          operationName,
          query,
          variables,
          http,
        };
        const execute =
          operationName != "IntrospectionQuery" &&
          operationName &&
          query &&
          http;

        if (execute) {
          // logger.info(data);
        }

        return {
          async() {
            if (execute) {
              const stop = Date.now();
              const elapsed = stop - start;
              logger.info(
                `Operation ${operationName} completed in ${elapsed} ms`
              );
              logRequestDB(
                operationName,
                query,
                JSON.stringify(variables),
                elapsed
              );
            }
          },
        };
      },
    },
  ],
});

async function main() {
  await server.start();

  const app = express();

  // This middleware should be added before calling`applyMiddleware`.
  app.use(graphqlUploadExpress());

  server.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log(
      `🚀 Server ready at http://localhost:4000${server.graphqlPath}`
    );
  });
}

main();
