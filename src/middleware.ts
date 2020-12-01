// @ts-ignore
import {Context} from "./context.ts";

export type MiddlewareNextFunction = () => Promise<unknown>;
export type MiddlewareFunction<ParamsType=any> = (ctx: Context<ParamsType>, next: MiddlewareNextFunction) => Promise<any>;
