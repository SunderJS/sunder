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

async function getPostHandler(ctx: Context<{id: string}>) {
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

## Route parameters
The router automatically extracts parameters from the URL, it is built upon the [`path-to-regexp`](https://github.com/pillarjs/path-to-regexp) library (the same as is used by [Express](https://expressjs.com)).

**Example**
```typescript
function myHandler(ctx: Context<{firstName: string, lastName: string}>) {
    ctx.response.body = `Hello ${ctx.params.firstName} ${ctx.params.lastName}!`;
}

const router = new Router();
router.get("/greeting/:firstName/:lastName", myHandler);

// If I now make a request to /greeting/Bob/Dogg it will return
// "Hello Bob Dogg"
```

Note how we write required parameters in the pointy brackets (`Context<{firstName: string}>`) on the handler. This allows the route to be statically type checked. If you are using Javascript just remove this type annotation.
