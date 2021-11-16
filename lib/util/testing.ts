import { Sunder } from "../application";

/**
 * Creates a new FetchEvent for the given request, runs it through the app and returns the response.
 * If a non-request object is passed, a GET request with application/json datatype is constructed from it.
 */
export function getResponse(
  app: Sunder,
  url: string,
  requestData?: RequestInit,
  env?: Record<string, any>
) {
  const request = new Request(url, requestData);
  //@ts-ignore
  const event = new FetchEvent("fetch", { request: request });
  return app.handle(event as FetchEvent, env);
}
