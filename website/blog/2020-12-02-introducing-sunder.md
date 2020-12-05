---
slug: introducing-sunder
title: Introducing Sunder
author: Guido Zuidhof
# author_title: Author of Sunder
author_url: https://github.com/gzuidhof
author_image_url: https://avatars1.githubusercontent.com/u/1039510?s=460&v=4
tags: []
---

Sunder is a framework for Service Workers like those found in [Cloudflare Workers](https://workers.cloudflare.com). It allows you to create testable APIs and websites in a similar way as you would using Node.js's [Koa](https://koajs.com) or [Express](https://expressjs.com) framework.


<!--truncate-->

Sunder is designed to be minimal, testable, and easy to understand. It's only a few hundred lines of code. 

#### A small example
```typescript
import {Sunder, Router} from "sunder";

const app = new Sunder();
const router = new Router();

// Example route with a named parameter
router.get("/hello/:username", ({response, params}) => {
    response.body = `Hello ${params.username}`;
});

app.use(router.middleware);

addEventListener('fetch', (event) => {
    const resp = app.handle(event);
    event.respondWith(resp);
});
```

This is a complete example, bundle it using a tool like [`esbuild`](https://esbuild.github.io/) in under 50ms and it's ready for use in Cloudflare workers.


## Everything is middleware
Inspired by Koa and Elixir's Plug, in Sunder everything is a *middleware*.

A middleware function takes two arguments, the request's `Context` and a function that invokes the next middleware. An example explains it best:

```typescript
async function responseTimeMiddleware(ctx, next) {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.response.set('X-Response-Time', `${ms}ms`);    
}
```

If you have used [Koa](https://koajs.com) in the past, this should look very familiar. By making use of the `async` keyword we can `await` asynchronous tasks and avoid callback hell. 

By composing this core building block we can handle any request in an elegant way.

## Strict routes

Typescript recently released support for <a href="https://devblogs.microsoft.com/typescript/announcing-typescript-4-1/#template-literal-types">Template Literal Types</a>. This allows us to type a route's path parameters in a strict way and catch common mistakes.

![Strict routes GIF](https://i.imgur.com/XeOyoxF.gif)

> Note: You can use Sunder without Typescript too, but you will miss out on this type checking.

## So can I use this?

Yes, you can install Sunder now (`npm i sunder`) and use it in your projects. It is open source under the MIT license.

It is however still a work in progress, things will change, and the docs are incomplete. The amount of available pre-written middleware is small. Contributions are of course welcome!
