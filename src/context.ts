import { proxyRequest } from "./util/requestProxy";
import { HttpStatus as HTTP, RedirectStatus } from "./status";
import {assert} from "./util/assert";
import { createError } from "./util/error";

export type ErrorProperties = object;
export type Params = Record<string, string | undefined> | {};

export class Context<ParamsType = {} , StateType = any> {

  private readonly event: FetchEvent;

  public request: Request;
  public url: URL;

  /**
   * The values that are extracted from the url path. 
   *  
   * Example for route:  
   * `"/my-route/:username/:post"`  
   * this would be an object like
   * 
   * ```
   * {username: string, post: string}
   * ```
   * 
   * WARNING: This value has to be set into the context, this is typically done by a router.
   */
  public params!: ParamsType;

  /**
   * The response init, from its fields the final `Response` is constructed.
   */
  public response: {
      body?: BodyInit;
      headers: Headers,
      status?: number;
      statusText?: string;
      /**
       * Utility function that sets the status to 302 and the `location` header to the passed value.
       */
      redirect: (url: string | URL, status: RedirectStatus) => void;
  }

  /**
   * The recommended namespace for passing information through middleware and to your frontend views.
   */
  public state: StateType;

  constructor(event: FetchEvent) {
      this.event = event;
      this.request = proxyRequest(event.request);
      this.url = new URL(this.request.url);
      this.response = {
          body: undefined,
          headers: new Headers({}),
          redirect: (url, status=HTTP.Found) => {      
            this.response.status = status; 
            this.response.headers.set('location', url instanceof URL ? url.href : url);
          }
      }
      this.state = Object.create(null);
  }

  public waitUntil(promise: Promise<any>) {
    this.event.waitUntil(promise);
  }

   /**
   * Throw an error with `status` (default 500) and
   * `msg`. Note that these are user-level
   * errors, and the message may be exposed to the client.
   * 
   * Examples:
   *```
   *    this.throw(403)
   *    this.throw(400, 'name required')
   *    this.throw('something exploded')
   *    this.throw(new Error('invalid'))
   *    this.throw(400, new Error('invalid'))
   * ```
   *
   * See: https://github.com/jshttp/http-errors
   */

  public throw(statusOrError: HTTP | string |  Error, message?: string | Error, props?: object) {
    throw createError(statusOrError, message, props);
  }

  public assert = assert;

  /**
   * To be called at the end when `this.response` field is all done.
   * This field is then used to construct a Response and it is sent using `event.respondWith`.
   */
  public respond() {
    const r = new Response(this.response.body, this.response);
    this.event.respondWith(r);
  }
}

/**
 * Drop in replacement for `Context` that is strict when it comes to state (defaulting to an empty state instead of `any`).
 */
export class StrictContext<ParamsType = {}, StateType = {}> extends Context<ParamsType, StateType> {
  
}