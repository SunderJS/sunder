import { Context } from "./context";
import { apply } from "./middleware/apply";
import { Middleware } from "./middlewareTypes";
import { MissingEnv} from "./util/errorHints"

export type CloudflareEventFunctions = Pick<FetchEvent, "waitUntil"> & Partial<Pick<FetchEvent, "passThroughOnException">>

/**
 * The main Sunder app class, this is the root of your Sunder-powered application.
 */
export class Sunder<EnvironmentType = Record<string, any>> {
    public state?: DurableObjectState;
    public silent = false;
    
    private middleware: Middleware<EnvironmentType, any>[] = [];
    
    constructor(opts: {state?: DurableObjectState} = {}) {
        this.state = opts.state;
    }

    /**
     * Handles given FetchEvent and returns a promise of the response. Note that this function catches errors and delegates them to the `this.onerror` function.
     * 
     * An optional second argument with the environment can be supplied.
     */
    async handle(event: CloudflareEventFunctions & {request: Request}, env: EnvironmentType = (MissingEnv as EnvironmentType)) {
        const ctx = new Context({event, env, request: event.request, state: this.state});

        try {
            await apply(this.middleware, ctx);
        }
        catch (e) {
            this.onerror(e);
        }
        return ctx.response.createResponse();
    }

    fetch(request: Request, env: EnvironmentType, ctx: FetchEvent | CloudflareEventFunctions) {
        // @ts-ignore
        ctx.request = request;
        return this.handle(ctx as typeof ctx & {request: Request}, env)
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
