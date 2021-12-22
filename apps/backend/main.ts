import { ApolloServer } from "apollo-server";
import { schema } from "./schema/schema";
import { context, prisma } from "./api/context";
import pino from "pino";
import { logRequestDB } from "./logging";

const dest = pino.destination({
  sync: false,
})
const logger = pino(dest)


const server = new ApolloServer({
  //@ts-ignore
  schema,
  context,
  plugins: [
    {
      async requestDidStart(ctx) {
        const start = Date.now()
        const { operationName, query, variables, http } = ctx.request
        const data = {
          operationName,
          query,
          variables, http
        }
        const execute = operationName != "IntrospectionQuery" && operationName && query && http

        if (execute) {
          logger.info(data);
        }

        return {
          async() {
            if (execute) {
              const stop = Date.now()
              const elapsed = stop - start
              logger.info(
                `Operation ${operationName} completed in ${elapsed} ms`
              )
              logRequestDB(operationName, query, JSON.stringify(variables), elapsed)
            }
          }
        }

      }

    },
  ],
});

async function main() {


  // for (let index = 0; index < 30; index++) {

  //   const d = await prisma.user.create({
  //     data: {
  //       name: "test123",
  //       email: `${Math.random() * 100}${index}`,
  //     }
  //   })


  //   for (let index = 0; index < 10; index++) {
  //     await prisma.classroom.create({
  //       data: {
  //         name: "123",
  //         userId: d.id,
  //       }
  //     })
  //   }
  // }

  server.listen(4000, () => {
    console.log("Server started on port " + 4000);
  });




}

main();
