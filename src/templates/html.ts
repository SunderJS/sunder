import { html, TemplateResult } from "@popeindustries/lit-html-server";

export interface DocumentTemplateContent {
    head?: TemplateResult | string;
    body?: TemplateResult | string;
    endOfBody?: TemplateResult | string;
    lang?: string
    title?: string
}

export function htmlDocumentTemplate(opts: DocumentTemplateContent) {
    return html`<!DOCTYPE html>
<html ${opts.lang ? html`lang="${opts.lang}"` : undefined}>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        ${opts.title !== undefined ? html`<title>${opts.title}</title>` : undefined}
        ${opts.head}
    </head>
    <body>
        ${opts.body}
        ${opts.endOfBody}
    </body>
</html>`
}