import { Context } from "./context";

export type Middleware<ParamsType = any, StateType = any> = (
  ctx: Context<ParamsType, StateType>,
  next: MiddlewareNextFunction,
) => Promise<any>;

/** A synchronous middleware only makes sense for a final handler */
export type SyncMiddleware<ParamsType = any, StateType = any> = (
  ctx: Context<ParamsType, StateType>,
  next: MiddlewareNextFunction,
) => any;

export type MiddlewareNextFunction = () => (Promise<any> | any);
