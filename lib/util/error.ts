/* Right now this simply wraps the http-errors package but with a stricter typing */

import * as createHttpError from "http-errors";
import { HttpStatus } from "../status";

export function createError(
  statusOrError: HttpStatus | string | Error,
  message?: string | Error,
  props?: object,
) {
  return createHttpError(statusOrError, message as any, props as any);
}
