import { mkdir } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { DEFAULT_PORT, STATE_DIR_NAME } from "./brand.js";

export const LOOPBACK_HOST = "127.0.0.1";
export const IPV6_LOOPBACK_HOST = "::1";

// Binding to a wildcard address means "all interfaces" - it is not itself a connectable
// target, so the CLI's local control channel falls back to the matching-family loopback.
// :: must fold to ::1 (not 127.0.0.1) because on macOS/BSD IPV6_V6ONLY defaults on, so a
// ::-bound socket rejects IPv4 loopback connections.
const WILDCARD_BIND_LOOPBACK = new Map([
  ["0.0.0.0", LOOPBACK_HOST],
  ["::", IPV6_LOOPBACK_HOST],
]);

function preferredEnv(env, primary, fallback) {
  return env[primary]?.trim() || env[fallback]?.trim() || "";
}

// Address the server binds to (ARMALO_EDITOR_HOST, with LAVISH_AXI_HOST as a migration
// fallback). Defaults to loopback. A wildcard value
// (0.0.0.0 or ::) binds every interface.
export function bindHost(env = process.env) {
  return preferredEnv(env, "ARMALO_EDITOR_HOST", "LAVISH_AXI_HOST") || LOOPBACK_HOST;
}

// Host the CLI uses to reach the server it spawned. A wildcard bind address can't be
// dialed directly, so the local control channel falls back to loopback.
export function clientHost(env = process.env) {
  const host = bindHost(env);
  return WILDCARD_BIND_LOOPBACK.get(host) ?? host;
}

// Hostname written into generated session URLs (ARMALO_EDITOR_LINK_HOST, with
// LAVISH_AXI_LINK_HOST as a migration fallback). Defaults to the host the CLI dials.
export function linkHost(env = process.env) {
  return preferredEnv(env, "ARMALO_EDITOR_LINK_HOST", "LAVISH_AXI_LINK_HOST") || clientHost(env);
}

// Brackets an IPv6 literal so it can be safely interpolated into a URL authority.
// IPv4 addresses and hostnames pass through unchanged.
export function hostForUrl(host) {
  if (host.includes(":") && !host.startsWith("[")) return `[${host}]`;
  return host;
}

export function stateDir(env = process.env) {
  return preferredEnv(env, "ARMALO_EDITOR_STATE_DIR", "LAVISH_AXI_STATE_DIR") || path.join(os.homedir(), STATE_DIR_NAME);
}

export function stateFile() {
  return path.join(stateDir(), "state.json");
}

export function serverLogFile() {
  return path.join(stateDir(), "server.log");
}

export async function ensureStateDir() {
  await mkdir(stateDir(), { recursive: true });
}

export function defaultPort(env = process.env) {
  return Number(preferredEnv(env, "ARMALO_EDITOR_PORT", "LAVISH_AXI_PORT") || DEFAULT_PORT);
}
