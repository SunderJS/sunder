import { Middleware } from "../lib/middlewareTypes";
import { apply, Context } from "../lib";

export function createEmptyFetchEvent(): FetchEvent {
    // @ts-ignore
    return new FetchEvent("fetch", {request: new Request("/")} as any);
}

export function createEmptyContext() {
    const event = createEmptyFetchEvent();
    return new Context({event: event, env: {}, request: event.request});
}

export async function applyOnEmptyContext(middleware: Middleware | Middleware[]) {
    const ctx = createEmptyContext();
    await apply(middleware, ctx).then(() => ctx);
    return ctx;
}
