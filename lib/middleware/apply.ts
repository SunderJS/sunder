import { Context } from "../context";
import { Middleware } from "../middlewareTypes";
import { compose } from "./compose";

/**
 *  Apply the given middleware to the context, useful for testing
 */
export function apply<EnvironmentType>(
  middleware: Middleware<EnvironmentType> | Middleware<EnvironmentType>[],
  ctx: Context<EnvironmentType>,
) {
  if (Array.isArray(middleware)) {
    middleware = compose(middleware);
  }
  return middleware(ctx, async () => undefined);
}
