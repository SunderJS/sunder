import {Sunder, Router, Context} from "../src/index";

// there is no addEventListener in Node, so we create it here
const addEventListener = (evt: string, listener: (e: FetchEvent) => void) => {};

describe("Application E2E examples", () => {

    test("Example in README", () => {
        const app = new Sunder();
        const router = new Router();
        
        // Example route with a named parameter
        router.get("/hello/:username", ({response, params}) => {
            response.body = `Hello ${params.username}`;
            response.set("content-type", "text/html");
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
    });
});