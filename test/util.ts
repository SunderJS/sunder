import { Middleware } from "../lib/middlewareTypes";
import { apply, Context } from "../lib/sunder";

export function createEmptyFetchEvent() {
    return new FetchEvent("fetch", {request: new Request("/")});
}

export function createEmptyContext() {
    return new Context(createEmptyFetchEvent());
}

export async function applyOnEmptyContext(middleware: Middleware | Middleware[]) {
    const ctx = createEmptyContext();
    await apply(middleware, ctx).then(() => ctx);
    return ctx;
}
