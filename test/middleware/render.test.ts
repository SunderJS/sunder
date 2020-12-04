import { apply, Context } from "../../lib";
import { renderErrorsAsJSON } from "../../lib/middleware/render";
import { createEmptyContext } from "../helpers";


describe("Render errors as JSON middleware", () => {
    test("Emits JSON error with correct status and message", async () => {
        const sadRoute = async (ctx: Context) => {
            ctx.throw(400, ":( sad");
        };

        const ctx = createEmptyContext();
        try {
            await apply([renderErrorsAsJSON, sadRoute], ctx);
            fail(); // Should have thrown the line before.

        } catch (e) {/* Ignore error */};
        const resp = ctx.respond();

        expect(resp.status).toEqual(400);
        expect(await resp.json()).toEqual({message: ":( sad"});
    })

})
