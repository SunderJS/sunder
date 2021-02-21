import { Middleware, Router } from "..";
import { Context, Params } from "../context";
import { MethodWildcard, PathParams, Method as MethodString } from "../middleware/router";
import { MiddlewareNextFunction, MiddlewareWithoutNext, SyncMiddlewareWithoutNext} from "../middlewareTypes";
import { Expand, Merge } from "../util/merge";


type State = Record<string, any>;
/**
 * The type that a router method has to be.
 */
type RouteMethod<ParamsType, EntryState> = MiddlewareWithoutNext<ParamsType, EntryState>

type Spread<L, R> = Pick<L, Exclude<keyof L, keyof R>> & R;

// type MiddlewareStack<PT, OUTSTATE> = OUTSTATE extends Spread<infer IS, infer A1> ? [Middleware<PT, IS, A1>] : never;

type Combine<OUT> = OUT extends (infer A & infer B) ? [A, B]: never;

async function addRequestId (ctx: Context<{}, {}, {requestId: string}>, next: MiddlewareNextFunction) {
    ctx.state.requestId = "asdf"
    next();
}

async function addOtherId (ctx: Context<{}, {}, {otherId: string}>, next: MiddlewareNextFunction) {
    ctx.state.otherId = "asdf"
    next();
}


export function Route<
    Path extends string, // The route path, e.g. "/books/:id"
    MiddlewareAddedState extends State, // The state that the specified middlewares need to add.
    InitialParamsType extends Params = {}, // The params that were present before the module handler is called, used for nesting
    InitialStateType extends State = {}, // The state that was present before the module handler is called, used for nesting
    >(
        method: MethodString,
        path: Path,
        // ...middleware: MiddlewareStack<InitialParamsType & PathParams<Path>, InitialStateType & MiddlewareAddedState>,
    ) {
    return function (
        target: Module<InitialParamsType, InitialStateType>,
        propertyKey: string,
        descriptor: TypedPropertyDescriptor<RouteMethod<Expand<InitialParamsType & PathParams<Path>>, Expand<InitialStateType & MiddlewareAddedState>>>) {
        return descriptor
    }
}


export class Module<InitialParamsType extends Params, InitialStateType extends State> {

    private router: Router<InitialStateType>;

    constructor(router: Router<InitialStateType>) {
        this.router = router;
    }
    
    // @Route("/test/:id")
    @Route<"/:id", {b: 3}>("GET", "/:id")
    async books(ctx: Context<{id: string}, {b: 3}>) {

        const x: Combine<{a:3, b:2}> = [{}, {b:2}]
        // const x: MiddlewareStack<{}, {requestId: string}> = [addRequestId];
        // ctx.state.requestId;
    }
}



const r = new Module(new Router());