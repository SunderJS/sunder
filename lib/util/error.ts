/* Right now this simply wraps the http-errors package but with a stricter typing
  and support for passing undefined for the second and third argument. */

import CreateHttpError from "http-errors";
import { HttpStatus } from "../status";

export function createHttpError(
  statusOrError: HttpStatus | string | Error,
  message?: string | Error,
  props?: object,
) {
  if (message === undefined) {
    return CreateHttpError(statusOrError);
  }
  if (props === undefined) {
    return CreateHttpError(statusOrError, message);
  }

  return CreateHttpError(statusOrError, message, props);
}

export function isHttpError(statusOrError: Error) {
  return CreateHttpError.isHttpError(statusOrError)
}