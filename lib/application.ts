import { Context } from "./context";
import { apply } from "./middleware/apply";
import { Middleware } from "./middlewareTypes";

export type CloudflareEventFunctions = Pick<FetchEvent, "waitUntil" | "passThroughOnException">

export class Sunder<EnvironmentType = Record<string, any>> {
    public silent = false;

    private middleware: Middleware<EnvironmentType, any>[] = [];

    /**
     * Handles given FetchEvent and returns a promise of the response. Note that this function catches errors and delegates them to the `this.onerror` function.
     * 
     * An optional second argument with the environment can be supplied.
     */
    async handle(event: CloudflareEventFunctions & {request: Request}, env?: EnvironmentType) {
        if (env === undefined) {
            // Note: We can not check this type without forcing the user to pass in their own env
            // as we don't want to force users to 
            env = {} as EnvironmentType; 

        }
        const ctx = new Context(event, env);
        try {
            await apply(this.middleware, ctx);
        }
        catch (e) {
            this.onerror(e);
        }
        return ctx.response.createResponse();
    }

    fetch(request: Request, env: EnvironmentType, ctx: CloudflareEventFunctions) {
        return this.handle({...ctx, request: request}, env)
    }

    /**
     * Registers a middleware function, note that the order matters!
     * @param fn
     */
    use<P = object>(fn: Middleware<EnvironmentType, P>) {
        if (typeof fn !== "function") {
            throw new TypeError("middleware must be a function!");
        }
        this.middleware.push(fn);
        return this;
    }

    onerror(err: Error) {
        const isNativeError =
            Object.prototype.toString.call(err) === "[object Error]" ||
            err instanceof Error;
        if (!isNativeError) {
            throw new TypeError((`non-error thrown: ${JSON.stringify(err)}`));
        }

        if (404 === (err as any).status || (err as any).expose) return;
        if (this.silent) return;

        const msg = err.stack || err.toString();
        console.error(`\n${msg.replace(/^/gm, "  ")}\n`);
    }
}
