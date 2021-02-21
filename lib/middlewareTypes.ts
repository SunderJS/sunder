import { Context } from "./context";
import { Expand, Merge } from "./util/merge";
/**
 * A middleware takes three generic types
 * `ParamsType`: the params it requires
 * `StateType`: the state it requires
 * `StateExtenstion`: the state that it will add, note you are responsible for adding this yourself.
 */
export type Middleware<ParamsType = any, StateType = any, StateExtension = {}> = (
  ctx: Context<ParamsType, StateType, StateExtension>,
  next: MiddlewareNextFunction,
) => Promise<any>;

export type MiddlewareWithoutNext<ParamsType = any, StateType = any> = (
  ctx: Context<ParamsType, StateType>,
) => Promise<any>;

/** A synchronous middleware only makes sense for a final handler */
export type SyncMiddleware<ParamsType = any, StateType = any, StateExtension = {}> = (
  ctx: Context<ParamsType, StateType, StateExtension>,
  next: MiddlewareNextFunction,
) => any;

export type SyncMiddlewareWithoutNext<ParamsType = any, StateType = any> = (
  ctx: Context<ParamsType, StateType>,
) => any;

export type MiddlewareNextFunction = () => (Promise<any> | any);

type AType<T, U> = T extends U ? U extends T ? T : [T, U] : [T, U];

export type Composition<P, InState, OutState> = OutState extends Merge<InState, infer A>
  ? [{params: Partial<P>, state: Partial<InState>, add: A}]: never;

const c: Composition<{a:3}, {b: string}, {b: string, c: string}> = [{params: {}, state: {}, add: {b: "a", c: "3"}}]


export type MiddlewareComposition<PT, InState, OutState> = 
  OutState extends Expand<InState & infer A> ? [Middleware<Partial<PT>, Partial<InState>, A>]: never;

// const x: MiddlewareComposition<{}, {b:5}, {a:3}> = [async (ctx: Context<{}, {b:5}, {a:3, b:3}>, next: MiddlewareNextFunction) => undefined];
