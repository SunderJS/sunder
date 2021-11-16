/**
 * This module was for the most part based on the code of cfworker's RequestBuilder
 * https://github.com/cfworker/cfworker/blob/master/packages/web/src/response-builder.ts
 *
 * The main differences:
 * - No magic static setting
 * - No magic statusText handling
 * - Removed etag, lastModified, type helpers, instead added 'set' and 'get' shorthands.
 *
 * (MIT Licensed)
 */

import { HeadersShorthands } from "../context";
import { HttpStatus, RedirectStatus } from "../status";

/**
 * The different types that can be sniffed and converted to a valid body automatically.
 */
export type ExtendedBodyInit = BodyInit | boolean | Date | number | object | undefined | null;

/**
 * The data that will be used as the response for the request.
 */
export class ResponseData implements ResponseInit, HeadersShorthands {
  public headers = new Headers({});
  public status?: number;
  public statusText?: string;

  /**
   * Cloudflare Worker websocket, non-standard API
   */
  public webSocket?: WebSocket | null;

  private _implicitType = false;
  private _stringifyBody = false;
  private _body: ExtendedBodyInit;

  get body() {
    return this._body;
  }
  set body(value: ExtendedBodyInit) {
    this._body = value;

    // no content
    if (value === undefined || value === null) {
      this.headers.delete("content-type");
      this.headers.delete("content-length");
      this.headers.delete("transfer-encoding");
      return;
    }

    // set Content-Type
    if (
      // Response will automatically use multipart/form-data.
      value instanceof FormData ||
      // Response will automatically use application/x-www-form-urlencoded.
      value instanceof URLSearchParams ||
      // Cannot determine Content-Type.
      ArrayBuffer.isView(value) ||
      value instanceof ArrayBuffer ||
      value instanceof ReadableStream
    ) {
      this._stringifyBody = false;
      if (this._implicitType) {
        this._implicitType = false;
        this.headers.delete("content-type");
      }
    } else if (typeof value === "string") {
      this._stringifyBody = false;
      if (!this.headers.has("content-type") || this._implicitType) {
        this._implicitType = true;
        if (/^\s*</.test(value)) {
          this.headers.set("content-type", "text/html;charset=UTF-8");
        } else {
          this.headers.set("content-type", "text/plain;charset=UTF-8");
        }
      }
    } else {
      this._stringifyBody = true;
      this._implicitType = true;
      this.headers.set("content-type", "application/json;charset=UTF-8");
    }
  }

  set(name: string, value: string) {
    this.headers.set(name, value);
  }

  get(name: string) {
    return this.headers.get(name);
  }

  has(name: string) {
    return this.headers.has(name);
  }

  /**
   * Sets the headers to a redirect header (`location`) with given status.
   * @param url
   * @param status Status of redirect, default to Status Found (302).
   */
  redirect(url: string | URL, status: RedirectStatus = HttpStatus.Found) {
    this.status = status;
    this.headers.set("location", url instanceof URL ? url.href : url);
  }

  /**
   * Overwrite the response with given response, useful when you are passing on a request from a Durable Object
   * or some other fetch request.
   * 
   * @param response Response that will overwrite the response being constructed so far.
   * @param opts You can set the option to `mergeHeaders` here, which keeps existing headers unless they are
   * overwritten. This is useful when you have middleware that set specific headers (such as CORS)
   * which you don't want to drop.
   */
  overwrite(response: Response, opts: {mergeHeaders?: boolean} = {}) {
    if (opts.mergeHeaders) {
      for(const [k,v] of response.headers) {
        this.headers.set(k, v);
      }
    } else {
      this.headers = response.headers;
    }
    this.body = response.body;
    this.status = response.status;
    this.statusText = response.statusText;
    this.webSocket = response.webSocket;
  }


  /**
   * Create a native Response object, which is what FetchEvent expects.
   */
  createResponse() {
    const { body: rawBody, status, statusText, headers, webSocket } = this;
    const body = this._stringifyBody ? JSON.stringify(rawBody) : (rawBody as BodyInit);
    const init: ResponseInit = {
      headers, webSocket
    }
    // These next 6 lines are technically not necessary, but due to a bug in undici
    // we will need it for now. undici is used by Miniflare. See issue https://github.com/nodejs/undici/issues/1094
    if (status !== undefined) {
      init.status = status;
    }
    if (statusText !== undefined) {
      init.statusText = statusText;
    }

    return new Response(body, init);
  }
}
