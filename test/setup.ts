// set up global namespace for worker environment

import makeCloudflareWorkerEnv, {
  } from 'cloudflare-worker-mock';
  

import fetch from "node-fetch"
const { Crypto } = require("@peculiar/webcrypto");

declare var global: any;
// @ts-ignore
Object.assign(global, makeCloudflareWorkerEnv());

Object.assign(global, {
    fetch: fetch,
    crypto: new Crypto()
});
