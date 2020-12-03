// set up global namespace for worker environment

import makeCloudflareWorkerEnv, {
  } from 'cloudflare-worker-mock';
  

// Node polyfills
import fetch from "node-fetch"
const { Crypto } = require("@peculiar/webcrypto");
import FormData from "formdata-node";

declare var global: any;
// @ts-ignore
Object.assign(global, makeCloudflareWorkerEnv());

Object.assign(global, {
    fetch: fetch,
    crypto: new Crypto(),
    FormData: FormData,
    ReadableStream: () => {} // Not really a polyfill
});
