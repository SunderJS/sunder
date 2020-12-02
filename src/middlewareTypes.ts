// @ts-ignore
import {Context} from "./context.ts";

export type MiddlewareNextFunction = () => (Promise<any> | any);
export type MiddlewareFunction<ParamsType=any> = (ctx: Context<ParamsType>, next: MiddlewareNextFunction) => Promise<any>;
