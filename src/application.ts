import { Context } from "./context";
import { composeMiddleware } from "./middleware/compose";
import { MiddlewareFunction } from "./middlewareTypes";

export class Sunder {

    public silent = false;
    /**
     * Whether the handleEvent method should automatically respond.
     */
    public respond = true;

    private middleware: MiddlewareFunction<any>[] = [];

    constructor() {

    }

    public async handleEvent(event: FetchEvent) {
        const ctx = new Context(event);
        const middleware = composeMiddleware(this.middleware);

        try {
            await middleware(ctx, async () => null);
        } catch(e) {
            this.onerror(e);
        }
        if (this.respond){
            ctx.respond();
        }
    }

    use<P = object>(fn: MiddlewareFunction<P>) {
        if (typeof fn !== 'function') throw new TypeError('middleware must be a function!');
        this.middleware.push(fn);
        return this;
    }

    onerror(err: Error) {
        const isNativeError = Object.prototype.toString.call(err) === '[object Error]' || err instanceof Error;
        if (!isNativeError) throw new TypeError((`non-error thrown: ${JSON.stringify(err)}`));

        if (404 === (err as any).status || (err as any).expose) return;
        if (this.silent) return;

        const msg = err.stack || err.toString();
        console.error(`\n${msg.replace(/^/gm, '  ')}\n`);
    }
}