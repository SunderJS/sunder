import { proxyRequest } from "./util/request";
import { HttpStatus } from "./status";
import { assert } from "./util/assert";
import { createHttpError } from "./util/error";
import { ResponseData } from "./util/response";
import { CloudflareEventFunctions } from "./application";
import { MissingDurableObjectState } from "./util/errorHints";

export type ErrorProperties = object;
export type Params = Record<string, string | undefined> | {};

export type HeadersShorthands = {
  /**
   * Convenience shorthand for headers.get
   */
  get: typeof Headers.prototype.get;
  /**
   * Convenience shorthand for headers.set
   */
  set: typeof Headers.prototype.set;

  /**
   * Convenience shorthand for headers.has
   */
  has: typeof Headers.prototype.has;
};

export class Context<EnvironmentType = Record<string, any>, ParamsType = {}, ContextDataType = any> {
  public readonly event: CloudflareEventFunctions & Record<string, any>;

  public request: Request & HeadersShorthands;
  public url: URL;
  public env: EnvironmentType;

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
   * The response data, from its fields the final `Response` is constructed.
   */
  public response: ResponseData;

  /**
   * The recommended namespace for passing information through middleware and to your frontend views.
   */
  public data: ContextDataType;

  /**
   * The Durable Object state.
   * 
   */
  public state: DurableObjectState;

  constructor(opts: {event: CloudflareEventFunctions, request: Request, env: EnvironmentType, state?: DurableObjectState}) {
    this.env = opts.env;
    this.event = opts.event;
    this.request = proxyRequest(opts.request);
    this.url = new URL(this.request.url);
    this.response = new ResponseData();
    this.data = Object.create(null);
    this.state = opts.state || MissingDurableObjectState;
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

  public throw(
    statusOrError: HttpStatus | string | Error,
    message?: string | Error,
    props?: object,
  ) {
    throw createHttpError(statusOrError, message, props);
  }

  public assert = assert;
}

/**
 * Drop in replacement for `Context` that is strict when it comes to user data (defaulting to an empty object instead of `any`).
 */
export class StrictContext<EnvironmentType = {}, ParamsType = {}, ContextDataType = {}>
  extends Context<EnvironmentType, ParamsType, ContextDataType> {}
