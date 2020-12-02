(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{70:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return s})),n.d(t,"metadata",(function(){return c})),n.d(t,"rightToc",(function(){return i})),n.d(t,"default",(function(){return d}));var a=n(3),r=n(7),o=(n(0),n(91)),s={id:"context",title:"Context"},c={unversionedId:"context",id:"context",isDocsHomePage:!1,title:"Context",description:"A Sunder Context encapsulates a FetchEvent's Request object and is used to construct a Response.",source:"@site/docs/context.md",slug:"/context",permalink:"/Sunder/docs/context",editUrl:"https://github.com/gzuidhof/sunder/edit/master/website/docs/context.md",version:"current",sidebar:"someSidebar",previous:{title:"Application",permalink:"/Sunder/docs/application"},next:{title:"Introduction to Middleware",permalink:"/Sunder/docs/middleware-introduction"}},i=[{value:"Context path parameters",id:"context-path-parameters",children:[]}],p={rightToc:i};function d(e){var t=e.components,n=Object(r.a)(e,["components"]);return Object(o.b)("wrapper",Object(a.a)({},p,n,{components:t,mdxType:"MDXLayout"}),Object(o.b)("p",null,"A Sunder ",Object(o.b)("inlineCode",{parentName:"p"},"Context")," encapsulates a FetchEvent's ",Object(o.b)("inlineCode",{parentName:"p"},"Request")," object and is used to construct a ",Object(o.b)("inlineCode",{parentName:"p"},"Response"),"."),Object(o.b)("p",null,"A ",Object(o.b)("inlineCode",{parentName:"p"},"Context")," is created per request, and is referenced in middleware as the receiver, or the ctx identifier, as shown in the following snippet:"),Object(o.b)("pre",null,Object(o.b)("code",Object(a.a)({parentName:"pre"},{className:"language-typescript"}),'app.use(async ctx => {\n  ctx.response.body = "Hello!";\n});\n')),Object(o.b)("p",null,"Often writing writing it like this instead makes for cleaner middleware:"),Object(o.b)("pre",null,Object(o.b)("code",Object(a.a)({parentName:"pre"},{className:"language-typescript"}),'app.use(async ({response}) => {\n  response.body = "Hello!";\n});\n')),Object(o.b)("h2",{id:"context-path-parameters"},"Context path parameters"),Object(o.b)("p",null,"Often parameters for the request are encoded in the ",Object(o.b)("inlineCode",{parentName:"p"},"Request"),"'s path. If you use Router middleware these will be extracted for you automatically and put on the ",Object(o.b)("inlineCode",{parentName:"p"},"ctx.params")," object. If you use Typescript you have to type your context according to what your handler requires:"),Object(o.b)("pre",null,Object(o.b)("code",Object(a.a)({parentName:"pre"},{className:"language-typescript"}),"// This could be used as a handler for route `/posts/:author`\napp.use(async ({params}: Context<{author: string}>) => {\n  response.body = `This is a post by ${params.author}`;\n});\n")),Object(o.b)("p",null,"Optional path parameters can also be specified using ",Object(o.b)("inlineCode",{parentName:"p"},"?"),"."))}d.isMDXComponent=!0}}]);