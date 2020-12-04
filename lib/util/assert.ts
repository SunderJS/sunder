import { ErrorProperties } from "../context";
import { HttpStatus as HTTP } from "../status";

import eql from "fast-deep-equal/es6";
import { createError } from "./error";

/* Based on https://github.com/jshttp/http-assert */

export function assertFunc(
  value: any,
  status: HTTP = HTTP.InternalServerError,
  msg?: string,
  opts?: ErrorProperties,
) {
  if (value) return;
  throw createError(status, msg as any, opts as any);
}

/**
 * Compares values using ==
 */
assertFunc.equal = function (
  a: any,
  b: any,
  status: HTTP = HTTP.InternalServerError,
  msg?: string,
  opts?: ErrorProperties,
) {
  assertFunc(a == b, status, msg, opts); // eslint-disable-line eqeqeq
};

/**
 * Compares values using !=
 */
assertFunc.notEqual = function (
  a: any,
  b: any,
  status: HTTP = HTTP.InternalServerError,
  msg?: string,
  opts?: ErrorProperties,
) {
  assertFunc(a != b, status, msg, opts); // eslint-disable-line eqeqeq
};

/**
 * Checks if the passed value is truthy
 */
assertFunc.ok = function (
  value: any,
  status: HTTP = HTTP.InternalServerError,
  msg?: string,
  opts?: ErrorProperties,
) {
  assertFunc(value, status, msg, opts);
};

/**
 * Compares values using ===
 */
assertFunc.strictEqual = function (
  a: any,
  b: any,
  status: HTTP = HTTP.InternalServerError,
  msg?: string,
  opts?: ErrorProperties,
) {
  assertFunc(a === b, status, msg, opts);
};

/**
 * Compares values using !==
 */
assertFunc.notStrictEqual = function (
  a: any,
  b: any,
  status: HTTP = HTTP.InternalServerError,
  msg?: string,
  opts?: ErrorProperties,
) {
  assertFunc(a !== b, status, msg, opts);
};

/**
 * Compares values using the `fast-deep-equal` library
 */
assertFunc.deepEqual = function (
  a: any,
  b: any,
  status: HTTP = HTTP.InternalServerError,
  msg?: string,
  opts?: ErrorProperties,
) {
  assertFunc(eql(a, b), status, msg, opts);
};

/**
 * Compares values using the `fast-deep-equal` library but negated
 */
assertFunc.notDeepEqual = function (
  a: any,
  b: any,
  status: HTTP = HTTP.InternalServerError,
  msg?: string,
  opts?: ErrorProperties,
) {
  assertFunc(!eql(a, b), status, msg, opts);
};

export const assert = assertFunc;
