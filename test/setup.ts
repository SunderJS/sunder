// set up global namespace for worker environment

import makeCloudflareWorkerEnv from "cloudflare-worker-mock";

// Node polyfills
import fetch from "node-fetch";
const { Crypto } = require("@peculiar/webcrypto");
import FormData from "formdata-node";

declare var global: any;

Object.assign(global, {
  ...makeCloudflareWorkerEnv(),
  fetch: fetch,
  crypto: new Crypto(),
  FormData: FormData,
  ReadableStream: () => {}, // Not really a polyfill
});

if (!process.env.LISTENING_TO_UNHANDLED_REJECTIONS) {
  process.on("unhandledRejection", (reason) => {
    throw reason;
  });
  // Avoid memory leak by adding too many listeners
  (process.env as any).LISTENING_TO_UNHANDLED_REJECTIONS = true;
}
