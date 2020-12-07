import {
  Params,
  Route,
  RouteOptions,
  Router as TRRouter,
} from "tiny-request-router";
import { Context } from "../context";
import { Middleware, MiddlewareNextFunction, SyncMiddleware } from "../middlewareTypes";

export type Method =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "HEAD"
  | "OPTIONS";
export type MethodWildcard = "ALL";

/**
 * A handler function just takes a context, you have to type the generic <Params> to use params 
 * in your Handler in a type-checked manner.
 * 
 * Example:
 * ```
 * const myHandler: Handler<{username: string}> = (ctx) => {
 *   ctx.response.body = `Hello ${ctx.params.username}!`;
 * }
 * ```
 */
export type Handler<ParamsType = {}> = Middleware<ParamsType> | SyncMiddleware<ParamsType>;
// ((ctx: Context<ParamsType>) => any | Promise<any>) | Middleware<ParamsType>;

/**
 * A stronger-typed version of `RouteMatch` in tiny-request-router
 */
export type RouteHandlerMatch<S extends string> = {
  params: PathParams<S> & Params;
  matches?: RegExpExecArray;
} & Route<Handler<PathParams<S>>>;

export type SplitRoute<S extends string> = string extends S ? string[]
  : S extends `${infer Start}/:${infer Param}/${infer Rest}`
    ? [Param, ...SplitRoute<Rest>]
  : S extends `${infer Start}/:${infer Param}` ? [Param]
  : [];

export type PathParams<S extends string> =
  & {
    [P in SplitRoute<S>[number]]: string;
  }
  & {
    [P in SplitRoute<S>[number]]?: string;
  };

/**
 * Router wraps the tiny-request-router `Router` with a more strict RouteHandler type and automatic params typings.
 */
export class Router {
  /**
     * The wrapped tiny-request-router Router.
     */
  public readonly internalRouter: TRRouter;

  constructor() {
    this.internalRouter = new TRRouter<Handler<Partial<Params>>>();
  }

  public get<S extends string>(
    path: S,
    handler: Handler<PathParams<S>>,
    opts?: RouteOptions,
  ) {
    this.internalRouter.get(path, handler, opts);
    return this;
  }

  public post<S extends string>(
    path: string,
    handler: Handler<PathParams<S>>,
    opts?: RouteOptions,
  ) {
    this.internalRouter.post(path, handler, opts);
    return this;
  }

  public head<S extends string>(
    path: string,
    handler: Handler<PathParams<S>>,
    opts?: RouteOptions,
  ) {
    this.internalRouter.head(path, handler, opts);
    return this;
  }

  public patch<S extends string>(
    path: string,
    handler: Handler<PathParams<S>>,
    opts?: RouteOptions,
  ) {
    this.internalRouter.patch(path, handler, opts);
    return this;
  }

  public put<S extends string>(
    path: string,
    handler: Handler<PathParams<S>>,
    opts?: RouteOptions,
  ) {
    this.internalRouter.put(path, handler, opts);
    return this;
  }

  public all<S extends string>(
    path: string,
    handler: Handler<PathParams<S>>,
    opts?: RouteOptions,
  ) {
    this.internalRouter.all(path, handler, opts);
    return this;
  }

  public delete<S extends string>(
    path: string,
    handler: Handler<PathParams<S>>,
    opts?: RouteOptions,
  ) {
    this.internalRouter.delete(path, handler, opts);
    return this;
  }

  public match<S extends string>(
    method: string,
    path: S,
  ): RouteHandlerMatch<S> | null {
    const match = this.internalRouter.match(method as Method, path) as
      | RouteHandlerMatch<S>
      | null;
    return match;
  }

  public readonly middleware = async (
    ctx: Context,
    next: MiddlewareNextFunction = () => undefined,
  ) => {
    const match = this.match(ctx.request.method, ctx.url.pathname);

    if (match === null) {
      ctx.throw(404, "Not found");
      return;
    } else {
      ctx.params = match.params;
      await match.handler(ctx, next);
    }
  };
}
