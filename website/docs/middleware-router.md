---
id: middleware-router
title: Router
---

A router helps you call different middleware based on the method and the URL of the request. Sunder ships with a default router that will work for most small to medium size applications.

```typescript
import { Sunder, Router } from "sunder";

const app = new Sunder();
const router = new Router();

function handleRobots(ctx: Context) {
    ctx.response.body = "User-Agent: *\nDisallow: /";
}

async function createPostHandler(ctx: Context) {
    // Talk to database, create a post..
}

async function getPostHandler(ctx: Context<{}, {id: string}>) {
    const postId = ctx.params.id;
    const postText = await myDatabase.getPost(id);
    ctx.response.body = postText;
}


router.get("/robots.txt", handleRobots);
router.post("/v1/posts", createPostHandler)
router.get("/posts/:id", getPostHandler)

// Tip: the router is usually the last middleware you add to the app.
app.use(router.middleware)
```

In case a request is made to a non-existing page, a 404 error is thrown. 

There is also a `Router.all(path, handler)` method that will catch all request methods (`GET`, `POST`, `PATCH`, etc). 

## CFW Environment
In Cloudflare Workers you can either ship your worker as a service-worker file, or a ES module. In the service-worker buildmode any KV stores and configuration values are available in the global scope (`globalThis.MY_KV_STORE`), in ES Module mode. When you create an app or a router you can specify the environment type as its first generic argument, for example:

```typescript
type MyEnvironment = {
    MY_KV_STORE: KVStore,
    APPLICATION_NAME: string,
}

const app = new Sunder<MyEnvironment>();
const router = new Router<MyEnvironment>();
```

Then in a middleware you can require a certain field to be available:

```typescript
function handleApplicationNameGet(ctx: Context<{APPLICATION_NAME: string}>) {
    ctx.response.body = `The application name is ${ctx.env.APPLICATION_NAME}`;
}
```

When you do this it will be statically type-checked by the Typescript compiler - preventing you from making mistakes.

## Route parameters
The router automatically extracts parameters from the URL, it is built upon the [`path-to-regexp`](https://github.com/pillarjs/path-to-regexp) library (the same as is used by [Express](https://expressjs.com)).

**Example**
```typescript
function myHandler(ctx: Context<{}, {firstName: string, lastName: string}>) {
    ctx.response.body = `Hello ${ctx.params.firstName} ${ctx.params.lastName}!`;
}

const router = new Router();
router.get("/greeting/:firstName/:lastName", myHandler);

// If I now make a request to /greeting/Bob/Dogg it will return
// "Hello Bob Dogg"
```

Note how we write required parameters in the pointy brackets (`Context<{}, {firstName: string}>`) on the handler. This allows the route to be statically type checked. If you are using Javascript just remove this type annotation.
