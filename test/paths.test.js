import assert from "node:assert/strict";
import test from "node:test";

import os from "node:os";
import path from "node:path";

import {
  bindHost,
  clientHost,
  defaultPort,
  hostForUrl,
  IPV6_LOOPBACK_HOST,
  LOOPBACK_HOST,
  linkHost,
  stateDir,
} from "../src/paths.js";

test("bindHost defaults to loopback and prefers ARMALO_EDITOR_HOST", () => {
  assert.equal(bindHost({}), LOOPBACK_HOST);
  assert.equal(bindHost({ ARMALO_EDITOR_HOST: "" }), LOOPBACK_HOST);
  assert.equal(bindHost({ ARMALO_EDITOR_HOST: "  " }), LOOPBACK_HOST);
  assert.equal(bindHost({ ARMALO_EDITOR_HOST: "100.64.0.1" }), "100.64.0.1");
  assert.equal(bindHost({ ARMALO_EDITOR_HOST: " 0.0.0.0 " }), "0.0.0.0");
  assert.equal(
    bindHost({ ARMALO_EDITOR_HOST: "100.64.0.2", LAVISH_AXI_HOST: "100.64.0.1" }),
    "100.64.0.2",
  );
  assert.equal(bindHost({ LAVISH_AXI_HOST: "100.64.0.1" }), "100.64.0.1");
});

test("clientHost dials the bind host but falls back to the matching-family loopback for wildcard binds", () => {
  assert.equal(clientHost({}), LOOPBACK_HOST);
  assert.equal(clientHost({ ARMALO_EDITOR_HOST: "100.64.0.1" }), "100.64.0.1");
  assert.equal(clientHost({ ARMALO_EDITOR_HOST: "0.0.0.0" }), LOOPBACK_HOST);
  assert.equal(clientHost({ ARMALO_EDITOR_HOST: "::" }), IPV6_LOOPBACK_HOST);
});

test("linkHost prefers ARMALO_EDITOR_LINK_HOST, then its migration alias, then the dial host", () => {
  assert.equal(linkHost({}), LOOPBACK_HOST);
  assert.equal(linkHost({ ARMALO_EDITOR_LINK_HOST: "host.example" }), "host.example");
  assert.equal(linkHost({ ARMALO_EDITOR_LINK_HOST: "  " }), LOOPBACK_HOST);
  assert.equal(
    linkHost({ ARMALO_EDITOR_LINK_HOST: "armalo.example", LAVISH_AXI_LINK_HOST: "lavish.example" }),
    "armalo.example",
  );
  assert.equal(linkHost({ LAVISH_AXI_LINK_HOST: "lavish.example" }), "lavish.example");
  // Non-wildcard bind with no explicit link host -> links reuse the bind address.
  assert.equal(linkHost({ ARMALO_EDITOR_HOST: "100.64.0.1" }), "100.64.0.1");
  // Wildcard bind with an explicit link host -> links use the hostname, not 0.0.0.0.
  assert.equal(
    linkHost({ ARMALO_EDITOR_HOST: "0.0.0.0", ARMALO_EDITOR_LINK_HOST: "host.example" }),
    "host.example",
  );
  // IPv6 wildcard bind with no explicit link host -> links fall back to the IPv6 loopback.
  assert.equal(linkHost({ ARMALO_EDITOR_HOST: "::" }), IPV6_LOOPBACK_HOST);
});

test("stateDir defaults to ~/.armalo-editor and supports the Lavish migration alias", () => {
  assert.equal(stateDir({}), path.join(os.homedir(), ".armalo-editor"));
  assert.equal(stateDir({ LAVISH_AXI_STATE_DIR: "/tmp/lavish-state" }), "/tmp/lavish-state");
  assert.equal(stateDir({ ARMALO_EDITOR_STATE_DIR: "/tmp/armalo-state" }), "/tmp/armalo-state");
  assert.equal(
    stateDir({ ARMALO_EDITOR_STATE_DIR: "/tmp/armalo-state", LAVISH_AXI_STATE_DIR: "/tmp/lavish-state" }),
    "/tmp/armalo-state",
  );
});

test("defaultPort defaults to 4390 and supports the Lavish migration alias", () => {
  assert.equal(defaultPort({}), 4390);
  assert.equal(defaultPort({ LAVISH_AXI_PORT: "4387" }), 4387);
  assert.equal(defaultPort({ ARMALO_EDITOR_PORT: "4391" }), 4391);
  assert.equal(defaultPort({ ARMALO_EDITOR_PORT: "4392", LAVISH_AXI_PORT: "4387" }), 4392);
});

test("hostForUrl brackets IPv6 literals but leaves IPv4 and hostnames alone", () => {
  assert.equal(hostForUrl("127.0.0.1"), "127.0.0.1");
  assert.equal(hostForUrl("host.example"), "host.example");
  assert.equal(hostForUrl("::1"), "[::1]");
  assert.equal(hostForUrl("[::1]"), "[::1]");
});
