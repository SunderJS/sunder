#!/usr/bin/env node
const { build } = require("estrella");
const { rmdir } = require("fs/promises");
build({
  entry: "lib/sunder.ts",
  outfile: "dist/sunder.bundle.js",
  bundle: true
});

