import Koa from "koa";
import bodyParser from "koa-bodyparser";
import Router from "@koa/router";
import cors from "@koa/cors";
import koaGraphQL, { OptionsData } from "koa-graphql";
import { koaPlayground } from "graphql-playground-middleware";

import schema from "./schema";

const app = new Koa();

const router = new Router();

app.use(bodyParser());
app.use(cors());

router.get("/health", async ctx => {
  try {
    ctx.body = "Koa is healthy";
    ctx.status = 200;
  } catch (err) {
    ctx.body = err.toString();
    ctx.status = 400;
  }
});

if (process.env.NODE_ENV !== "production") {
  router.all(
    "/playground",
    koaPlayground({
      endpoint: "/graphql"
    })
  );
}

router.all(
  "/graphql",
  koaGraphQL(
    async (request, ctx, koaContext): Promise<OptionsData> => {
      return {
        graphiql: process.env.NODE_ENV !== "production",
        schema,
        rootValue: {
          request: ctx.req
        }
      };
    }
  )
);

app.use(router.routes()).use(router.allowedMethods());

export default app;
