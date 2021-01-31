/* Right now this simply wraps the http-errors package but with a stricter typing */

import CreateHttpError from "http-errors";
import { HttpStatus } from "../status";

export function createHttpError(
  statusOrError: HttpStatus | string | Error,
  message?: string | Error,
  props?: object,
) {
  return CreateHttpError(statusOrError, message as any, props as any);
}

export function isHttpError(statusOrError: Error) {
  return CreateHttpError.isHttpError(statusOrError)
}