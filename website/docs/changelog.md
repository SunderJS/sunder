---
id: changelog
title: Changelog
---


## 0.7.1
**Date:** 2021-02-14

* Added missing `Router#options` function to the router to handle OPTIONS requests.


## 0.7.0
**Date:**: 2021-01-31

* Potentially breaking change: Rename `createError` to `createHttpError` (not exposed from top level Sunder package, but you may have imported it anyway).
* Handlers and Middleware now have a second generic argument, their `StateType`, which allows you to type what `context.state` your handler/middleware expects.
* The `Router` class now has a generic type argument, which allows you to define the type of `context.state` when it enters your Router.
