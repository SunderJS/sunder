import { isHttpError } from "http-errors";
import { Context, Router } from "../../lib";

function createFetchEvent(request?: Request) {
  if (request === undefined) {
    request = new Request("/");
  }
  return new FetchEvent("fetch", { request });
}

describe("Router matching", () => {
  test("Router matches", async () => {
    const myRoute = (ctx: Context) => {
      ctx.response.set("my-header", "some-value");
    };

    const router = new Router();
    router.get("/route", myRoute);

    const matchUnknownRoute = router.match("GET", "/");
    expect(matchUnknownRoute).toBeNull();

    const match = router.match("GET", "/route");
    expect(match).toBeDefined();

    const ctx = new Context(createFetchEvent());
    await match!.handler(ctx, () => undefined);
    expect(ctx.response.headers.get("my-header")).toEqual("some-value");
  });

  test("Router middleware sets params", async () => {
    const testId = "abc";
    const r = (ctx: Context<{ id: string }>) => {
      expect(ctx.params.id).toEqual(testId);
    };

    const router = new Router();
    router.get("/post/:id", r);

    const req = new Request(`/post/${testId}`, { method: "GET" });
    const context = new Context(createFetchEvent(req));

    await router.middleware(context);
  });

  test("Router middleware throws 404 http error on unknown route", async () => {
    const router = new Router();
    const req = new Request(`/doesntexist`, { method: "GET" });
    const context = new Context(createFetchEvent(req));

    try {
      await router.middleware(context, async () => {
        fail("404 was still cascaded");
      });
      fail();
    } catch (e) {
      expect(isHttpError(e)).toBeTruthy();
      expect(e.status).toEqual(404);
    }
  });

  test("Understands /:name+ routes", async () => {
    const testPath = "abc/def";
    const r = (ctx: Context<{ path: string }>) => {
      expect(ctx.params.path).toEqual(testPath);
    };

    const router = new Router();
    router.get("/post/:path+", r);

    const req = new Request(`/post/${testPath}`, { method: "GET" });
    const context = new Context(createFetchEvent(req));

    await router.middleware(context);
  });
});
