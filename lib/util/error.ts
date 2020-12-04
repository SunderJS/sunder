/* Right now this simply wraps the http-errors package but with a stricter typing */

import CreateHttpError from "http-errors";
import { HttpStatus } from "../status";

export function createError(
  statusOrError: HttpStatus | string | Error,
  message?: string | Error,
  props?: object,
) {
  return CreateHttpError(statusOrError, message as any, props as any);
}
