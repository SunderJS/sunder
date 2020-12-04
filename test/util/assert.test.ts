import { HttpError } from "http-errors";
import { Context, HttpStatus } from "../../lib";
import { applyOnEmptyContext } from "../helpers";

describe("Assert on Context", () => {
  test("Basic truthiness assertions", async () => {
    const falseHandler = async (ctx: Context) => ctx.assert(false);
    await expect(() => applyOnEmptyContext(falseHandler)).rejects.toThrow(
      HttpError,
    );

    const falsyHandler = async (ctx: Context) => ctx.assert(false);
    await expect(() => applyOnEmptyContext(falsyHandler)).rejects.toThrow(
      HttpError,
    );

    const trueHandler = async (ctx: Context) => ctx.assert(true);
    await expect(() => applyOnEmptyContext(trueHandler)).not.toThrow();

    const truthyHandler = async (ctx: Context) => ctx.assert(1);
    await expect(() => applyOnEmptyContext(truthyHandler)).not.toThrow();
  });

  test("Sets status", async () => {
    const defaultStatus = async (ctx: Context) => ctx.assert(false);
    await expect(() => applyOnEmptyContext(defaultStatus)).rejects
      .toMatchObject({ status: 500 });

    const customStatus = async (ctx: Context) =>
      ctx.assert(false, HttpStatus.BadRequest);
    await expect(() => applyOnEmptyContext(customStatus)).rejects.toMatchObject(
      { status: HttpStatus.BadRequest },
    );
  });

  test("Deep equals", async () => {
    const complex = new Map(
      [["a", {}], ["k", { a: 21, b: new Map([["0", undefined]]) }]],
    );
    const complexAgain = new Map(
      [["a", {}], ["k", { a: 21, b: new Map([["0", undefined]]) }]],
    );
    const complexDifferent = new Map(
      [["a", {}], ["k", { a: 21, b: new Map([["0", null]]) }]],
    );

    const m1 = async (ctx: Context) =>
      ctx.assert.deepEqual(complex, complexDifferent);
    await expect(() => applyOnEmptyContext(m1)).rejects.toThrow(HttpError);

    const m2 = async (ctx: Context) =>
      ctx.assert.deepEqual(complex, complexAgain);
    await expect(() => applyOnEmptyContext(m2)).not.toThrow();

    const m3 = async (ctx: Context) => ctx.assert.deepEqual(complex, complex);
    await expect(() => applyOnEmptyContext(m3)).not.toThrow();

    const m4 = async (ctx: Context) =>
      ctx.assert.notDeepEqual(complex, complexDifferent);
    await expect(() => applyOnEmptyContext(m4)).not.toThrow();
  });
});
