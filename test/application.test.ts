import {Sunder, Router, Context} from "../lib/sunder";
import { getResponseTo } from "./helpers";

// there is no addEventListener in Node, so we create it here
const addEventListener = (evt: string, listener: (e: FetchEvent) => void) => {};

describe("Application E2E examples", () => {
    test("Example in README", async () => {
        const app = new Sunder();
        const router = new Router();
        
        // Example route with a named parameter
        router.get("/hello/:username", ({response, params}) => {
            response.body = `Hello ${params.username}`;
        });
    
        // Example middleware
        app.use(async (ctx: Context, next: () => void) => {
            const start = Date.now();
            await next();

            const ms = Date.now() - start;
            ctx.response.set('X-Response-Time', `${ms}ms`);    
        });
        app.use(router.middleware);
        
        addEventListener('fetch', (event) => {
            app.handleEvent(event);
        });

        // TODO add actual tests
        expect(app.respond).toBeTruthy();
        
        const resp = await getResponseTo(new Request("/hello/mia"), app);
        expect(resp.headers.has("x-response-time")).toBeTruthy();
        expect(await resp.text()).toEqual("Hello mia");
        expect(resp.headers.get("content-type")).toEqual("text/plain;charset=UTF-8");
    });
});