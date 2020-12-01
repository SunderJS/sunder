import { isHttpError } from "http-errors";
import { Context } from "../context";
import { HttpStatus } from "../status";
import { MiddlewareNextFunction } from "../middleware";

export async function renderErrorsAsJSON<P>(ctx: Context<P>, next: MiddlewareNextFunction) {
    try {
        await next();
    } catch(err) {
        if (isHttpError(err)) {
            ctx.response.status = err.status; 
            // All original headers are deleted
            ctx.response.headers = new Headers(err.headers);
            if (err.expose) {
                ctx.response.body = JSON.stringify({message: err.message})
            } else {
                ctx.response.body = HttpStatus[err.status].toString();
            }
        } else {
            ctx.response.status = HttpStatus.InternalServerError;
            // All original headers are deleted
            ctx.response.headers = new Headers();
            ctx.response.body = "Internal server error: non-http error."
        }

        ctx.response.headers.set("content-type", "application/json");
        throw err;
    }
}