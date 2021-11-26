---
id: middleware-introduction
title: 👋 Introduction to Middleware
sidebar_label: 👋 Introduction
---

A middleware is a function that takes a context, and a function that will apply the next middleware. It is a good idea to use the `async` keyword for these functions so you can use `await`.

Sunder ships with some middleware, it is up to you to *compose* them. For any non-trivial app you should use the [`Router`](/docs/middleware-router) middleware.

### Example one: Middleware that logs all requests
```typescript
// Note that in Cloudflare Workers this will always log 0ms as Date.now() always
// returns the time of the request instead of the wall clock time.
async function logRequestsMiddleware(ctx, next: Middleware) {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
}
```

### Example two: Middleware that prints all errors to console

```typescript
async function logErrorsMiddleware(ctx, next: Middleware) {
  try {
    await next();
  } catch(e) {
    console.error(e);
    throw e;
  }
}
```


### Further reading
* [**A blogpost about Koa middleware chaining**](https://medium.com/trabe/the-elegance-of-asynchronous-middleware-chaining-in-koa-js-ea965f337e63): Sunder uses the exact same mechanisms as Koa.
