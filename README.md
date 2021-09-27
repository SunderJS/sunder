[![CI](https://github.com/gzuidhof/Sunder/workflows/CI/badge.svg)](https://github.com/gzuidhof/Sunder/actions)
[![NPM badge](https://img.shields.io/npm/v/sunder)](https://www.npmjs.com/package/sunder)
[![Documentation](https://img.shields.io/badge/Read%20the-documentation-1abc9c.svg)](https://gzuidhof.github.io/Sunder/docs)

**Sunder** is a minimal server-side framework for ServiceWorker environments. It is intended for websites and APIs built on [Cloudflare Workers](https://workers.cloudflare.com/).

Think of it as Express or Koa for serverless which allows you to quickly build websites and APIs in a modern async structure. Also important: it is easy to write tests for.
Sunder allows you to be strict about the data your routes expect to give you more certainty in production: the environment, parameter and state can be defined and will be type checked for you.

<!-- Technologies it pairs with especially well:

* [Serverless worker environments](https://workers.cloudflare.com/).
* [ESBuild](https://esbuild.github.io/) for <50ms builds, allowing for very fast iteration.
* [lit-html](https://https://lit-html.polymer-project.org/) for both [serverside](https://github.com/popeindustries/lit-html-server) and clientside templating. This enables websites without a runtime/front-end framework.
* [Typescript](https://https://www.typescriptlang.org/). Sunder is especially strict when it comes to path parameters: parameters in routes are statically checked at build time!

All four of these are optional in your own project. -->

**The easiest way to get started with Sunder on Cloudflare Workers is to use the [template project](https://github.com/gzuidhof/sunder-worker-template).**

## Documentation
Read the documentation [**here**](https://sunderjs.com/docs), or check out the introductory blog post [here](https://sunderjs.com/blog).

## Installation
```bash
npm i --save sunder
# or
yarn add sunder
```

## Example

```typescript
import {Sunder, Router, Context} from "sunder";

const app = new Sunder();
const router = new Router();

// Example route with a named parameter
router.get("/hello/:username", ({response, params}) => {
    response.body = `Hello ${params.username}`;
});

// Example middleware
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();

    const ms = Date.now() - start;
    ctx.response.set('X-Response-Time', `${ms}ms`);    
});
app.use(router.middleware);

addEventListener('fetch', (event) => {
  const fe = event as FetchEvent; // Only required in Typescript
  fe.respondWith(app.handle(fe));
});
```

## Modules example

```typescript
import {Sunder, Router, Context} from "sunder";

const app = new Sunder();
const router = new Router();

// Example route with a named parameter
router.get("/hello/:username", ({response, params}) => {
    response.body = `Hello ${params.username}`;
});

// Example middleware
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();

    const ms = Date.now() - start;
    ctx.response.set('X-Response-Time', `${ms}ms`);    
});
app.use(router.middleware);

export default {
    fetch(request, ctx, env) {
        return app.fetch(request, ctx, env);
    }
};
```

## Highlight feature: strict route parameters
![Strict routes gif](https://i.imgur.com/XeOyoxF.gif)

## Inspiration

The Sunder framework was inspired by Elixir's [plug](https://github.com/elixir-plug/plug), Node's [Koa](https://koajs.com/) framework, [tiny-request-router]() and [cfworker](https://github.com/cfworker/cfworker)'s web package.

Sunder is only a few hundred lines of code. It has little magic and doesn't impose too much structure.

## License
MIT
