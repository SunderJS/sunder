import { Context } from "../context";
import { Middleware } from "../middlewareTypes";
import { compose } from "./compose";

/**
 *  Apply the given middleware to the context, useful for testing
 */
export function apply(
  middleware: Middleware | Middleware[],
  ctx: Context,
) {
  if (Array.isArray(middleware)) {
    middleware = compose(middleware);
  }
  return middleware(ctx, async () => undefined);
}
