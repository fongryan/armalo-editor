import assert from "node:assert/strict";
import test from "node:test";

import {
  BRAND,
  CLI_NAME,
  DEFAULT_PORT,
  PACKAGE_NAME,
  PRODUCT_NAME,
  SERVER_APP_NAME,
  STATE_DIR_NAME,
  SURFACE_LABEL,
  UPSTREAM_ATTRIBUTION,
} from "../src/brand.js";

test("brand contract centralizes the Armalo Editor public and runtime identity", () => {
  assert.equal(PRODUCT_NAME, "Armalo Mission Control");
  assert.equal(SURFACE_LABEL, "Canvas · Editor");
  assert.equal(CLI_NAME, "armalo-editor");
  assert.equal(PACKAGE_NAME, "armalo-editor");
  assert.equal(SERVER_APP_NAME, "armalo-editor");
  assert.equal(STATE_DIR_NAME, ".armalo-editor");
  assert.equal(DEFAULT_PORT, 4390);
  assert.deepEqual(UPSTREAM_ATTRIBUTION, {
    productName: "Lavish Editor",
    cliName: "lavish-axi",
    repository: "https://github.com/kunchenguid/lavish-axi",
    author: "Kun Chen",
    license: "MIT",
  });
});

test("brand contract is immutable", () => {
  assert.equal(Object.isFrozen(BRAND), true);
  assert.equal(Object.isFrozen(UPSTREAM_ATTRIBUTION), true);
  assert.deepEqual(BRAND, {
    productName: PRODUCT_NAME,
    surfaceLabel: SURFACE_LABEL,
    cliName: CLI_NAME,
    packageName: PACKAGE_NAME,
    serverAppName: SERVER_APP_NAME,
    stateDirName: STATE_DIR_NAME,
    defaultPort: DEFAULT_PORT,
    upstreamAttribution: UPSTREAM_ATTRIBUTION,
  });
});
