import { html } from "@popeindustries/lit-html-server";

export function htmlBaseTemplate(opts: {
    head?: any,
    body?: any
    lang: string
    title?: string
} = {lang: "en"}) {
    
    return html`<!DOCTYPE html>
<html lang="${opts.lang}">
    <head>
        <meta charset="utf-8">
        ${opts.title !== undefined ? html`<title>${opts.title}</title>` : undefined}
        ${opts.head}
    </head>
    <body>
        ${opts.body}
    </body>
</html>
    `
}