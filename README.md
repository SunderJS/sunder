<img width="517" alt="Sunder Logo" src="https://user-images.githubusercontent.com/1039510/141459664-a4338625-d2d0-4d67-8725-e9d343e0a492.png">

[![CI](https://github.com/gzuidhof/Sunder/workflows/CI/badge.svg)](https://github.com/gzuidhof/Sunder/actions)
[![License](https://img.shields.io/github/license/sunderjs/sunder)](./LICENSE)
[![NPM badge](https://img.shields.io/npm/v/sunder)](https://www.npmjs.com/package/sunder)
[![Documentation](https://img.shields.io/badge/Read%20the-documentation-1abc9c.svg)](https://gzuidhof.github.io/Sunder/docs)

Sunder allows you to quickly build websites and APIs in a modern async structure on [Cloudflare Workers](https://workers.cloudflare.com). Think of Sunder as Express or Koa for serverless. 

Sunder is
* Fast
* Small
* Easy to test
* Typesafe

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

The Sunder framework was inspired by Elixir's [plug](https://github.com/elixir-plug/plug), Node's [Koa](https://koajs.com/) framework, [tiny-request-router](https://www.npmjs.com/package/tiny-request-router) and [cfworker](https://github.com/cfworker/cfworker)'s web package.

Sunder is only a few hundred lines of code. It has little magic and doesn't impose too much structure.

## License
MIT
