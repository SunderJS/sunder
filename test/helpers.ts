import { Sunder } from "../lib/sunder";

export async function getResponseTo(req: Request, app: Sunder): Promise<Response> {
    const event = new FetchEvent("fetch", {request: req});
    const resp = new Promise((resolve) => {
        event.respondWith = (r => {
            resolve(r);
        })
    });
    
    app.handleEvent(event);
    return resp as Promise<Response>;
}