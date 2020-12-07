import { Context } from "./context";

export type Middleware<ParamsType = any> = (
  ctx: Context<ParamsType>,
  next: MiddlewareNextFunction,
) => Promise<any>;

/** A synchronous middleware only makes sense for a final handler */
export type SyncMiddleware<ParamsType = any> = (
  ctx: Context<ParamsType>,
  next: MiddlewareNextFunction,
) => any;

export type MiddlewareNextFunction = () => (Promise<any> | any);
