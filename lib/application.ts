import { Context } from "./context";
import { apply } from "./middleware/apply";
import { Middleware } from "./middlewareTypes";

export class Sunder {
  public silent = false;
  /**
     * Whether the handleEvent method should automatically respond.
     */
  public respond = true;

  private middleware: Middleware<any>[] = [];

  /**
   * Handles given FetchEvent, automatically responding. Note that this function catches errors and delegates them to the `this.onerror` function.
   * 
   * You can disable automatic responding by setting `this.respond` to false.
   * 
   * For convenience this returns the response, which is useful for testing the app end-to-end.
   */
  public async handleEvent(event: FetchEvent) {
    const ctx = new Context(event);
    const p = new Promise(async resolve => {
      try {
        await apply(this.middleware, ctx);
      } catch (e) {
        this.onerror(e);
      }
      resolve(ctx.response.createResponse());
    }) as Promise<Response>;

    if (this.respond) {
      event.respondWith(p);
    }
    return p;
  }

  /**
   * Registers a middleware function, note that the order matters!
   * @param fn
   */
  use<P = object>(fn: Middleware<P>) {
    if (typeof fn !== "function") {
      throw new TypeError("middleware must be a function!");
    }
    this.middleware.push(fn);
    return this;
  }

  onerror(err: Error) {
    const isNativeError =
      Object.prototype.toString.call(err) === "[object Error]" ||
      err instanceof Error;
    if (!isNativeError) {
      throw new TypeError((`non-error thrown: ${JSON.stringify(err)}`));
    }

    if (404 === (err as any).status || (err as any).expose) return;
    if (this.silent) return;

    const msg = err.stack || err.toString();
    console.error(`\n${msg.replace(/^/gm, "  ")}\n`);
  }
}
