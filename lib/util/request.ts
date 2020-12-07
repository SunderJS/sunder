import { safeParse } from "secure-json-parse";
import { HeadersShorthands } from "../context";

/**
 * Proxies a Request object such that the body parsing functions are consumable multiple
 * times by caching the result. It also parses JSON with protection against prototype poisoning.
 * @param request
 */
export function proxyRequest(request: Request): Request & HeadersShorthands {
  let _arrayBuffer: Promise<ArrayBuffer> | undefined;
  let _formData: Promise<FormData> | undefined;
  let _json: Promise<any> | undefined;
  let _text: Promise<string> | undefined;

  return new Proxy(request, {
    get(target, property, receiver) {
      if (property === "arrayBuffer") {
        if (_arrayBuffer !== undefined) {
          return () => _arrayBuffer;
        }
        return () => _arrayBuffer = target.arrayBuffer();
      } else if (property === "formData") {
        if (_formData !== undefined) {
          return () => _formData;
        }
        return () => _formData = target.formData();
      } else if (property === "json") {
        if (_json !== undefined) {
          return () => _json;
        }
        return (reviver?: any) =>
          _json = target.text().then((text) => safeParse(text, reviver));
      } else if (property === "text") {
        if (_text !== undefined) {
          return () => _text;
        }
        return () => _text = target.text();

        // Convenience shorthands
      } else if (property === "get") {
        return (name: string) => target.headers.get(name);
      } else if (property === "set") {
        return (name: string, value: string) => target.headers.set(name, value);
      } else if (property === "has") {
        return (name: string) => target.headers.has(name);
      }

      return (target as any)[property];
    },
  }) as Request & HeadersShorthands;
}
