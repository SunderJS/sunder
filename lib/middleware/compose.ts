import { Context } from "../context";
import { Middleware, MiddlewareNextFunction } from "../middlewareTypes";

/**
 * Compose an array of `middleware` returning
 * a fully valid middleware comprised of all those which are passed.
 * 
 * Based on the code in the MIT licensed `koa-compose` package.
 *
 */
export function compose<EnvironmentType>(middleware: Middleware<EnvironmentType>[]): Middleware<EnvironmentType> {
  if (!Array.isArray(middleware)) {
    throw new TypeError("Middleware stack must be an array!");
  }

  for (const fn of middleware) {
    if (typeof fn !== "function") {
      throw new TypeError("Middleware must be composed of functions!");
    }
  }

  return function (context: Context<EnvironmentType>, next: MiddlewareNextFunction) {
    let lastCalledIndex = -1;
    return (async function dispatch(
      currentCallIndex,
    ): Promise<MiddlewareNextFunction | void> {
      if (currentCallIndex <= lastCalledIndex) {
        throw new Error("next() called multiple times");
      }
      lastCalledIndex = currentCallIndex;
      let fn = middleware[currentCallIndex];
      if (currentCallIndex === middleware.length) fn = (next as any); // TODO fix this typing..
      if (!fn) return;
      try {
        return fn(context, dispatch.bind(null, currentCallIndex + 1));
      } catch (err) {
        throw err;
      }
    })(0);
  };
}
