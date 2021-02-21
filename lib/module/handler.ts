import { Handler, Router } from "..";
import { Context } from "../context";
import { PathParams } from "../middleware/router";
import { Middleware, MiddlewareWithoutNext, SyncMiddlewareWithoutNext} from "../middlewareTypes";



export function get<S extends string>(path: S, middlewares?: Middleware<PathParams<S>>[]) {
    return function (target: Module<any>, propertyKey: string, descriptor: TypedPropertyDescriptor<MiddlewareWithoutNext<PathParams<S>> | SyncMiddlewareWithoutNext<PathParams<S>>>) {
        return descriptor;
    }
}


export class Module<InitialStateType> {

    private router: Router<InitialStateType>;

    constructor(router: Router<InitialStateType>) {
        this.router = router;
    }
    

    @get("/test")
    async books(ctx: Context<{}>) {

    }
}