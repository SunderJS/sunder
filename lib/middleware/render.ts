import { isHttpError } from "http-errors";
import { Context } from "../context";
import { HttpStatus } from "../status";
import { MiddlewareNextFunction } from "../middlewareTypes";

export async function renderErrorsAsJSON(
  ctx: Context<any>,
  next: MiddlewareNextFunction,
) {
  try {
    await next();
  } catch (err) {
    // All original headers are deleted
    ctx.response.headers = new Headers(err.headers ?? {});

    if (isHttpError(err)) {
      ctx.response.status = err.status;
      if (err.expose) {
        ctx.response.body = { message: err.message };
      } else {
        ctx.response.body = { message: err.status + " " + HttpStatus[err.status].toString() }
      }
    } else {
      ctx.response.status = HttpStatus.InternalServerError;
      ctx.response.body = { message: "Internal server error: non-http error." }
    }
    throw err;
  }
}
