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
 * A handler function just takes a context, you have to type the generic <Environment, Params> to use params 
 * in your Handler in a type-checked manner.
 * 
 * Consider a handler your "final" middleware, usually it's the one that adds the HTML or JSON to the response.
 * 
 * Example:
 * ```
 * const myHandler: Handler<{}, {username: string}> = (ctx) => {
 *   ctx.response.body = `Hello ${ctx.params.username}!`;
 * }
 * ```
 */
export type Handler<EnvironmentType = Record<string, any>, ParamsType = {}, ContextDataType = any> = Middleware<EnvironmentType, ParamsType, ContextDataType> | SyncMiddleware<EnvironmentType, ParamsType, ContextDataType>;

/**
 * A stronger-typed version of `RouteMatch` in tiny-request-router
 */
export type RouteHandlerMatch<S extends string> = {
  params: PathParams<S> & Params;
  matches?: RegExpExecArray;
} & Route<Handler<PathParams<S>>>;

/** Split type `"one/:two/:three?/:four"` into `["one", ":two", ":three?", ":four"]` */
type SplitPath<S extends string> =
    string extends S ? string[] :
    S extends `${infer A}/${infer B}` ? [A, ...SplitPath<B>] :
    [S];

/** Convert type `"one" | ":two" | ":three?" | ":four"` into `"two" | "four"` */
type ExtractRequiredParams<S extends string> =
    string extends S ? string :
    S extends `:${infer A}?` ? never :
    S extends `:${infer A}` ? A :
    never;

/** Convert type `"one" | ":two" | ":three?" | ":four"` into `"three"` */
type ExtractOptionalParams<S extends string> =
    string extends S ? string :
    S extends `:${infer A}?` ? A :
    never;

/** 
 * Convert a route path string literal type such as "one/:two/:three?/:four" 
 * into a params interface like `{ two: string; three?: string; four: string }`
 */
 export type PathParams<S extends string> = {
  [P in ExtractRequiredParams<SplitPath<S>[number]>]: string;
} & {
  [P in ExtractOptionalParams<SplitPath<S>[number]>]?: string;
};

/**
 * Router wraps the tiny-request-router `Router` with a more strict RouteHandler type and automatic params typings.
 * 
 * Optionally you can supply a generic type definition for userdata that is shared between all endpoints in this router.
 */
export class Router<EnvironmentType = Record<string, any>, InitialContextDataType={}> {
  /**
     * The wrapped tiny-request-router Router.
     */
  public readonly internalRouter: TRRouter;

  constructor() {
    this.internalRouter = new TRRouter<Handler<Partial<Params>>>();
  }

  public get<S extends string>(
    path: S,
    handler: Handler<EnvironmentType, PathParams<S>, InitialContextDataType>,
    opts?: RouteOptions,
  ) {
    this.internalRouter.get(path, handler, opts);
    return this;
  }

  public post<S extends string>(
    path: S,
    handler: Handler<EnvironmentType, PathParams<S>, InitialContextDataType>,
    opts?: RouteOptions,
  ) {
    this.internalRouter.post(path, handler, opts);
    return this;
  }

  public head<S extends string>(
    path: S,
    handler: Handler<EnvironmentType, PathParams<S>, InitialContextDataType>,
    opts?: RouteOptions,
  ) {
    this.internalRouter.head(path, handler, opts);
    return this;
  }

  public patch<S extends string>(
    path: S,
    handler: Handler<EnvironmentType, PathParams<S>, InitialContextDataType>,
    opts?: RouteOptions,
  ) {
    this.internalRouter.patch(path, handler, opts);
    return this;
  }

  public put<S extends string>(
    path: S,
    handler: Handler<EnvironmentType, PathParams<S>, InitialContextDataType>,
    opts?: RouteOptions,
  ) {
    this.internalRouter.put(path, handler, opts);
    return this;
  }

  public delete<S extends string>(
    path: S,
    handler: Handler<EnvironmentType, PathParams<S>, InitialContextDataType>,
    opts?: RouteOptions,
  ) {
    this.internalRouter.delete(path, handler, opts);
    return this;
  }

  public options<S extends string>(
    path: S,
    handler: Handler<EnvironmentType, PathParams<S>, InitialContextDataType>,
    opts?: RouteOptions,
  ) {
    this.internalRouter.options(path, handler, opts);
    return this;
  }

  public all<S extends string>(
    path: S,
    handler: Handler<EnvironmentType, PathParams<S>, InitialContextDataType>,
    opts?: RouteOptions,
  ) {
    this.internalRouter.all(path, handler, opts);
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
