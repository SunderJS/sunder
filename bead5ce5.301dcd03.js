(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{78:function(e,n,t){"use strict";t.r(n),t.d(n,"frontMatter",(function(){return i})),t.d(n,"metadata",(function(){return s})),t.d(n,"rightToc",(function(){return c})),t.d(n,"default",(function(){return l}));var r=t(3),a=t(7),o=(t(0),t(91)),i={id:"application",title:"Application"},s={unversionedId:"application",id:"application",isDocsHomePage:!1,title:"Application",description:"A Sunder application is an object containing an array of middleware functions which are composed and executed in a stack-like manner upon request.",source:"@site/docs/application.md",slug:"/application",permalink:"/Sunder/docs/application",editUrl:"https://github.com/gzuidhof/sunder/edit/master/website/docs/application.md",version:"current",sidebar:"someSidebar",previous:{title:"Introduction",permalink:"/Sunder/docs/"},next:{title:"Context",permalink:"/Sunder/docs/context"}},c=[{value:"Cascading",id:"cascading",children:[]},{value:"Error handling",id:"error-handling",children:[]}],p={rightToc:c};function l(e){var n=e.components,t=Object(a.a)(e,["components"]);return Object(o.b)("wrapper",Object(r.a)({},p,t,{components:n,mdxType:"MDXLayout"}),Object(o.b)("p",null,"A Sunder application is an object containing an array of middleware functions which are composed and executed in a stack-like manner upon request. "),Object(o.b)("p",null,"The obligatory hello world application:"),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{className:"language-typescript"}),"import {Sunder} from \"sunder\n\nconst app = new Sunder();\n\napp.use(async ({response}) => {\n  response.body = 'Hello World';\n});\n\naddEventListener('fetch', (event) => {\n    app.handleEvent(event);\n});\n")),Object(o.b)("h2",{id:"cascading"},"Cascading"),Object(o.b)("p",null,'Sunder middleware cascade in a more traditional way as you may be used to with similar tools - with async functions we can achieve "true" middleware. Contrasting ',Object(o.b)("a",Object(r.a)({parentName:"p"},{href:"https://expressjs.com"}),"Express"),'\'s implementation which simply passes control through series of functions until one returns, Sunder invokes "downstream", then control flows back "upstream".'),Object(o.b)("p",null,"The following example responds with ",Object(o.b)("inlineCode",{parentName:"p"},'"Hello World"'),", however first the request flows through the ",Object(o.b)("em",{parentName:"p"},"x-response-time")," and ",Object(o.b)("em",{parentName:"p"},"logging")," middleware to mark when the request started, then continue to yield control through the response middleware. When a middleware invokes ",Object(o.b)("inlineCode",{parentName:"p"},"next()")," the function suspends and passes control to the next middleware defined. After there are no more middleware to execute downstream, the stack will unwind and each middleware is resumed to perform its upstream behaviour."),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{className:"language-typescript"}),"import {Sunder} from \"sunder\n\nconst app = new Sunder();\n\n// logger\n\napp.use(async (ctx, next) => {\n  await next();\n  const rt = ctx.response.headers.get('X-Response-Time');\n  console.log(`${ctx.method} ${ctx.url} - ${rt}`);\n});\n\n// x-response-time\n\napp.use(async (ctx, next) => {\n  const start = Date.now();\n  await next();\n  const ms = Date.now() - start;\n  ctx.response.headers.set('X-Response-Time', `${ms}ms`);\n});\n\n// response\napp.use(async ctx => {\n  ctx.response.body = 'Hello World';\n});\n\naddEventListener('fetch', (event) => {\n    app.handleEvent(event);\n});\n\n")),Object(o.b)("h2",{id:"error-handling"},"Error handling"),Object(o.b)("p",null,"By default outputs all errors to stderr unless ",Object(o.b)("inlineCode",{parentName:"p"},"app.silent")," is true. The default error handler also won't output errors when ",Object(o.b)("inlineCode",{parentName:"p"},"err.status")," is 404 or ",Object(o.b)("inlineCode",{parentName:"p"},"err.expose")," is ",Object(o.b)("inlineCode",{parentName:"p"},"true"),". To perform custom error-handling logic such as centralized logging you can override the error handling:"),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{className:"language-typescript"}),"app.onerror = err => {\n  log.error('server error', err)\n});\n")),Object(o.b)("p",null,"When an error occurs, by default Sunder will respond appropriately with a ",Object(o.b)("inlineCode",{parentName:"p"},'500 "Internal Server Error"'),'. In either case an app-level "error" is emitted for logging purposes.'),Object(o.b)("blockquote",null,Object(o.b)("p",{parentName:"blockquote"},"Note: This documentation page was copied with slight modifications from the Koa docs (it is that similar!).")))}l.isMDXComponent=!0}}]);