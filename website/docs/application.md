---
id: application
title: 🔥 Application
---

A Sunder application is an object containing an array of middleware functions which are composed and executed in a stack-like manner upon request. 

The obligatory hello world application:

```typescript
import {Sunder} from "sunder"

const app = new Sunder();

app.use(async ({response}) => {
  response.body = 'Hello World';
});

addEventListener('fetch', (event) => {
  const fe = event as FetchEvent; // Only required in Typescript
  fe.respondWith(app.handle(fe));
});
```


## Cascading

Sunder middleware cascade in a more traditional way than you may be used to with similar tools. With async functions we can achieve "true" middleware. Contrasting [Express](https://expressjs.com)'s implementation which simply passes control through series of functions until one returns, Sunder invokes "downstream", then control flows back "upstream".

The following example responds with `"Hello World"`, however first the request flows through the *x-response-time* and *logging* middleware to mark when the request started, then continue to yield control through the response middleware. When a middleware invokes `next()` the function suspends and passes control to the next middleware defined. After there are no more middleware to execute downstream, the stack will unwind and each middleware is resumed to perform its upstream behaviour.

```typescript
import {Sunder} from "sunder

const app = new Sunder();

// logger

app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get('X-Response-Time');
  console.log(`${ctx.request.method} ${ctx.url} - ${rt}`);
});

// x-response-time

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.response.set('X-Response-Time', `${ms}ms`);
});

// response
app.use(async ctx => {
  ctx.response.body = 'Hello World';
});

addEventListener('fetch', (event) => {
    app.handleEvent(event);
});

```

## Error handling
By default outputs all errors to stderr unless `app.silent` is true. The default error handler also won't output errors when `err.status` is 404 or `err.expose` is `true`. To perform custom error-handling logic such as centralized logging you can override the error handling:

```typescript
app.onerror = err => {
  log.error('server error', err)
});
```

When an error occurs, by default Sunder will respond appropriately with a `500 "Internal Server Error"`. In either case an app-level "error" is emitted for logging purposes.

> Note: This documentation page was copied with slight modifications from the Koa docs (it is that similar!).
