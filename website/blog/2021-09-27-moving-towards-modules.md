---
slug: moving-towards-modules
title: Moving Towards Cloudflare Workers Modules
author: Guido Zuidhof
# author_title: Author of Sunder
author_url: https://github.com/gzuidhof
author_image_url: https://avatars1.githubusercontent.com/u/1039510?s=460&v=4
tags: []
---

Sunder now supports the [the new ES Modules syntax for Cloudflare Workers](https://developers.cloudflare.com/workers/cli-wrangler/configuration#modules). By opting into modules you can get rid of relying on global variables floating around your codebase, and also unlock Durable Objects.

<!--truncate-->

Before this was an option the entrypoint to your application would look something like this:

```typescript
import {Sunder, Router} from "sunder";

const app = new Sunder();
const router = new Router();

router.get("/hello/:username", ({response, params}) => {
    response.body = `Hello ${params.username}`;
});

app.use(router.middleware);

addEventListener('fetch', (event) => {
    const resp = app.handle(event);
    event.respondWith(resp);
});
```

Now, new in version `0.8.0`, there is also a `fetch` function on the app which allows you to use the new syntax easily.

```typescript
import {Sunder, Router} from "sunder";

const app = new Sunder();
const router = new Router();

router.get("/hello/:username", ({response, params}) => {
    response.body = `Hello ${params.username}`;
});

app.use(router.middleware);

export default {
    fetch(request, env, ctx) {
        return app.fetch(request, env, ctx);
    }
}

// Technically you could also use `export default app` if you only want to
// subscribe to the fetch event.
```