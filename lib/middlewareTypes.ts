import { Context } from "./context";

export type Middleware<ParamsType = any, StateType = any> = (
  ctx: Context<ParamsType, StateType>,
  next: MiddlewareNextFunction,
) => Promise<any>;

export type MiddlewareWithoutNext<ParamsType = any, StateType = any> = (
  ctx: Context<ParamsType, StateType>,
) => Promise<any>;


/** A synchronous middleware only makes sense for a final handler */
export type SyncMiddleware<ParamsType = any, StateType = any> = (
  ctx: Context<ParamsType, StateType>,
  next: MiddlewareNextFunction,
) => any;

export type SyncMiddlewareWithoutNext<ParamsType = any, StateType = any> = (
  ctx: Context<ParamsType, StateType>,
) => any;

export type MiddlewareNextFunction = () => (Promise<any> | any);
