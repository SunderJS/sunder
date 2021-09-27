---
id: context
title: Context
---

A Sunder `Context` encapsulates a FetchEvent's `Request` object and is used to construct a `Response`.

A `Context` is created per request, and is referenced in middleware as the receiver, or the ctx identifier, as shown in the following snippet:

```typescript
app.use(async ctx => {
  ctx.response.body = "Hello!";
});
```

Often writing writing it like this instead makes for cleaner middleware:

```typescript
app.use(async ({response}) => {
  response.body = "Hello!";
});
```

## Context path parameters
Often parameters for the request are encoded in the `Request`'s path. If you use Router middleware these will be extracted for you automatically and put on the `ctx.params` object. If you use Typescript you have to type your context according to what your handler requires:

```typescript
// This could be used as a handler for route `/posts/:author`
app.use(async ({params}: Context<{}, {author: string}>) => {
  response.body = `This is a post by ${params.author}`;
});
```

Optional path parameters can also be specified using `?`.
