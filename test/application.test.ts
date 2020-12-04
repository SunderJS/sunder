import { Context, Router, Sunder } from "../lib";
import { getResponse } from "../lib/util/testing";

describe("Application E2E examples", () => {
  test("Example in README", async () => {
    const app = new Sunder();
    const router = new Router();

    // Example route with a named parameter
    router.get("/hello/:username", ({ response, params }) => {
      response.body = `Hello ${params.username}`;
    });

    // Example middleware
    app.use(async (ctx: Context, next: () => void) => {
      const start = Date.now();
      await next();

      const ms = Date.now() - start;
      ctx.response.set("X-Response-Time", `${ms}ms`);
    });
    app.use(router.middleware);

    // TODO add actual tests
    expect(app.respond).toBeTruthy();

    const resp = await getResponse(app, "/hello/mia");
    expect(resp.headers.has("x-response-time")).toBeTruthy();
    expect(await resp.text()).toEqual("Hello mia");
    expect(resp.headers.get("content-type")).toEqual(
      "text/plain;charset=UTF-8",
    );
  });
});
