import { safeParse } from 'secure-json-parse';

/**
 * Proxies a Request object such that the body parsing functions are consumable multiple
 * times by caching the result. It also parses JSON with protection against prototype poisoning.
 * @param request
 */
export function proxyRequest(request: Request) {
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
                return (reviver?: any) => _json = target.text().then(text => safeParse(text, reviver));
            } else if (property === "text") {
                if (_text !== undefined) {
                    return () => _text;
                }
                return () => _text = target.text();
            }

            return Reflect.get(target, property, receiver);
        }
    })
}

// export function assignState<V extends object, C extends Context>(ctx: C, value: V): C & {state: V} {
//     Object.assign(ctx.state, value);
//     return ctx;
// }
