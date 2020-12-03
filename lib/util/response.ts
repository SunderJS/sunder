/**
 * This module was for the most part based on the code of cfworker's RequestBuilder
 * https://github.com/cfworker/cfworker/blob/master/packages/web/src/response-builder.ts
 * 
 * The main differences:
 * - No magic static setting
 * - No magic statusText handling
 * - Body can not be null, instead it detauls to undefined like in BodyInit
 * - Removed etag, lastModified, type helpers, instead added 'set' and 'get' shorthands.
 * 
 * (MIT Licensed)
*/

import { HeadersShorthands } from "../context";
import { HttpStatus, RedirectStatus } from "../status";

/**
 * The different types that can be sniffed and converted to a valid body automatically.
 */
export type ExtendedBodyInit =
  | BodyInit
  | boolean
  | Date
  | number
  | object
  | undefined;

// Polyfill: Cloudflare workers do not define the Blob class.
const Blob = self.Blob || ((class {} as any) as Blob);

/**
 * The data that will be used as the response for the request.
 */
export class ResponseData implements ResponseInit, HeadersShorthands {
  public headers = new Headers({});
  public status?: number;
  public statusText?: string;

  private _implicitType = false;
  private _stringifyBody = false;
  private _body: ExtendedBodyInit;
  
  get body() {
    return this._body;
  }
  set body(value: ExtendedBodyInit) {
    this._body = value;

    // no content
    if (value === undefined) {
      this.headers.delete('content-type');
      this.headers.delete('content-length');
      this.headers.delete('transfer-encoding');
      return;
    }

    // set Content-Type
    if (
      // Response will automatically use Blob's type.
      value instanceof Blob ||
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
        this.headers.delete('content-type');
      }
    } else if (typeof value === 'string') {
      this._stringifyBody = false;
      if (!this.headers.has('content-type') || this._implicitType) {
        this._implicitType = true;
        if (/^\s*</.test(value)) {
          this.headers.set('content-type', 'text/html;charset=UTF-8');
        } else {
          this.headers.set('content-type', 'text/plain;charset=UTF-8');
        }
      }
    } else {
      this._stringifyBody = true;
      this._implicitType = true;
      this.headers.set('content-type', 'application/json;charset=UTF-8');
    }
  }

  set(name: string, value: string) {
    this.headers.set(name, value);
  }

  get(name: string) {
    return this.headers.get(name);
  }

  has(name: string) {
    return this.headers.has(name)
  }

  redirect(url: string | URL, status: RedirectStatus = HttpStatus.Found) {
    this.status = status; 
    this.headers.set('location', url instanceof URL ? url.href : url);
  }

  createResponse() {
    const { body: rawBody, status, statusText, headers } = this;
    const body = this._stringifyBody
      ? JSON.stringify(rawBody)
      : (rawBody as BodyInit);
    return new Response(body, { status, statusText, headers });
  }
}