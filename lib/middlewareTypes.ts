import { Context } from "./context";

export type MiddlewareNextFunction = () => (Promise<any> | any);
export type Middleware<ParamsType = any> = (
  ctx: Context<ParamsType>,
  next: MiddlewareNextFunction,
) => Promise<any>;
