# Armalo Editor Rebrand Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship an upstream-compatible fork whose repository, package, CLI, generated skill, local state, documentation, and loaded browser chrome are unmistakably Armalo, with “Armalo Mission Control” as the product frame and “Canvas · Editor” as the interaction surface.

**Architecture:** Add one small brand-contract module for public identifiers and copy, then route the CLI/server/build surfaces through it while deliberately preserving the existing internal `lavish:*` browser protocol and data attributes for upstream compatibility. Use new `ARMALO_EDITOR_*` environment variables and `~/.armalo-editor` state by default, accept the old variables only as documented migration fallbacks, and use port 4390 so Armalo Editor can run beside Lavish AXI. Match the Armalo app’s light-first paper/ink design system with committed green `#00e5a0`, while keeping the artifact iframe visually independent and portable.

**Tech Stack:** Node.js 22 ESM, Express 5, axi-sdk-js, esbuild, node:test, CSS, pnpm.

---

## Chunk 1: Identity and runtime contract

### Task 1: Brand constants and isolated runtime identity

**Files:**
- Create: `src/brand.js`
- Create: `test/brand.test.js`
- Modify: `src/paths.js`
- Modify: `test/paths.test.js`
- Modify: `src/server.js`
- Modify: `test/server.test.js`

- [ ] **Step 1: Write failing brand-contract tests**

Assert that the public product is `Armalo Mission Control`, the surface is `Canvas · Editor`, the CLI/package name is `armalo-editor`, the server identity is `armalo-editor`, the default state directory is `~/.armalo-editor`, and the default port is 4390. Assert that `ARMALO_EDITOR_*` variables win and `LAVISH_AXI_*` variables remain fallback-only migration aliases.

- [ ] **Step 2: Run the focused tests and confirm RED**

Run: `node --test test/brand.test.js test/paths.test.js test/server.test.js`

Expected: FAIL because `src/brand.js`, the Armalo environment contract, and the new server identity do not exist.

- [ ] **Step 3: Implement the minimal brand contract**

Create immutable exported constants for product, surface, CLI, package, server app, state directory, default port, and upstream attribution. Update path/environment resolution and `/health` to use them. Do not rename `lavish:*`, `data-lavish-*`, session JSON element IDs, or whiteboard wire messages; document those as a compatibility boundary rather than creating a high-conflict protocol fork.

- [ ] **Step 4: Run focused tests and confirm GREEN**

Run: `node --test test/brand.test.js test/paths.test.js test/server.test.js`

Expected: PASS.

- [ ] **Step 5: Commit**

Run: `git add src/brand.js src/paths.js src/server.js test/brand.test.js test/paths.test.js test/server.test.js && git commit -m "feat: establish Armalo Editor runtime identity"`

### Task 2: Package, binary, build, and AXI command rebrand

**Files:**
- Create: `bin/armalo-editor.js`
- Delete: `bin/lavish-axi.js`
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Modify: `scripts/build.js`
- Modify: `src/cli.js`
- Modify: `test/cli-output.test.js`
- Modify: `test/package-json.test.js`

- [ ] **Step 1: Write failing public-CLI tests**

Update tests to require `armalo-editor` in the executable path, help, structured next steps, hook installation marker, process/server detection, log paths, package metadata, and build entrypoint. Add an explicit assertion that the no-argument description identifies the tool as the dynamic Canvas/Editor surface inside Armalo Mission Control.

- [ ] **Step 2: Run focused tests and confirm RED**

Run: `node --test test/cli-output.test.js test/package-json.test.js`

Expected: FAIL on the old package, binary, repository, and command strings.

- [ ] **Step 3: Implement the public CLI rename**

Rename the executable, package metadata, build entrypoint, public command examples, hook marker/file names, health/process matching, errors, diagnostics, and `ARMALO_EDITOR_*` documentation. Preserve TOON output shape, non-interactive behavior, contextual next steps, exit codes, and all existing command semantics. Keep the third-party `ht-ml.app` disclosure explicit and rename only Armalo-owned surfaces.

- [ ] **Step 4: Refresh the lockfile and run focused tests**

Run: `pnpm install --lockfile-only && node --test test/cli-output.test.js test/package-json.test.js`

Expected: PASS.

- [ ] **Step 5: Commit**

Run: `git add bin package.json pnpm-lock.yaml scripts/build.js src/cli.js test/cli-output.test.js test/package-json.test.js && git commit -m "feat: rebrand the AXI command as armalo-editor"`

## Chunk 2: Human and agent surfaces

### Task 3: Generated Agent Skill rebrand

**Files:**
- Modify: `src/skill.js`
- Rename: `skills/lavish/SKILL.md` to `skills/armalo-editor/SKILL.md`
- Modify: `scripts/build-skill.js`
- Modify: `test/skill.test.js`
- Modify: `test/package-json.test.js`

- [ ] **Step 1: Write failing skill-generation tests**

Require frontmatter name `armalo-editor`, title `Armalo Editor`, author `Armalo`, `npx -y armalo-editor` commands, the Armalo package path fallback, and package inclusion of `skills/armalo-editor`. Require the generated description to position the editor as the dynamic Canvas feedback surface, not a replacement orchestrator.

- [ ] **Step 2: Run focused tests and confirm RED**

Run: `node --test test/skill.test.js test/package-json.test.js`

Expected: FAIL on old skill identity and paths.

- [ ] **Step 3: Implement and regenerate the skill**

Update the generator and build check, rename the public skill directory, then run `pnpm run build:skill`. Keep the internal design playbook compatible unless it is visible to end users; update only user-facing copy and commands.

- [ ] **Step 4: Run focused tests and confirm GREEN**

Run: `node --test test/skill.test.js test/package-json.test.js && node scripts/build-skill.js --check`

Expected: PASS.

- [ ] **Step 5: Commit**

Run: `git add src/skill.js skills scripts/build-skill.js test/skill.test.js test/package-json.test.js && git commit -m "feat: ship the Armalo Editor agent skill"`

### Task 4: Loaded browser chrome and Armalo design system

**Files:**
- Modify: `src/server.js`
- Modify: `src/chrome-client.js`
- Modify: `src/chrome.css`
- Modify: `test/server.test.js`
- Modify: `test/chrome-client-queue.test.js`

- [ ] **Step 1: Write failing browser-brand tests**

Require default tab title `Armalo Mission Control`, artifact titles suffixed with `Armalo`, an accessible Armalo folded-paper SVG mark, visible wordmark `Armalo`, support label `Canvas · Editor`, Armalo copy in layout/presence/share overlays, and CSS tokens matching the canonical paper/ink/green system. Assert no visible loaded chrome copy says `Lavish` while preserving internal `lavish:*` protocol strings.

- [ ] **Step 2: Run focused tests and confirm RED**

Run: `node --test test/server.test.js test/chrome-client-queue.test.js`

Expected: FAIL on the current Lavish wordmark, title, copy, and brass/dark design tokens.

- [ ] **Step 3: Implement the loaded Armalo experience**

Render the folded-paper mark from the canonical Armalo logo geometry, use Instrument Serif/Georgia for the wordmark and Geist/system sans/mono fallbacks, apply the light-first paper palette with dark token remap, green focus/annotation accents, and update every user-visible chrome string. Maintain keyboard accessibility, responsive layout, iframe sandboxing, severe-layout gate behavior, and third-party publishing warnings.

- [ ] **Step 4: Run focused tests and confirm GREEN**

Run: `node --test test/server.test.js test/chrome-client-queue.test.js`

Expected: PASS.

- [ ] **Step 5: Commit**

Run: `git add src/server.js src/chrome-client.js src/chrome.css test/server.test.js test/chrome-client-queue.test.js && git commit -m "feat: load Armalo Mission Control browser chrome"`

## Chunk 3: Ownership, proof, and publication

### Task 5: Documentation, attribution, and upstream workflow

**Files:**
- Modify: `README.md`
- Modify: `LICENSE`
- Modify: `THIRD-PARTY-NOTICES.md`
- Modify: `CONTRIBUTING.md`
- Modify: `AGENTS.md`
- Ensure: `CLAUDE.md` symlink to `AGENTS.md`
- Create: `soul.md`
- Create: `docs/UPSTREAM.md`
- Create: `examples/armalo-mission-control.html`

- [ ] **Step 1: Add a failing documentation contract test**

Create or extend a repository test to require: preserved Kun Chen MIT notice, Armalo fork copyright without removing upstream ownership, explicit “Forked from Lavish AXI” attribution, the upstream remote/sync commands, the Mission Control/Canvas/Editor product hierarchy, security disclosure for public sharing, a do-not-run guard for agent-readable command examples, and no obsolete no-mistakes or PR-only workflow requirement.

- [ ] **Step 2: Run the focused test and confirm RED**

Run: `node --test test/agents-md.test.js test/package-json.test.js`

Expected: FAIL because the fork docs and ownership contracts do not yet exist.

- [ ] **Step 3: Write the fork-native documentation and demo**

Rewrite the README around Armalo Editor while crediting upstream prominently. Add a compact `soul.md` with the approved product thesis and design source, an upstream-sync runbook that never pushes to upstream, updated contribution rules for the workspace’s mainline mode, and an interactive local Mission Control demo artifact that exercises native controls and queued feedback without inventing a second state authority.

- [ ] **Step 4: Run documentation tests and format checks**

Run: `node --test test/agents-md.test.js test/package-json.test.js && pnpm run format:check`

Expected: PASS.

- [ ] **Step 5: Commit**

Run: `git add README.md LICENSE THIRD-PARTY-NOTICES.md CONTRIBUTING.md AGENTS.md CLAUDE.md soul.md docs/UPSTREAM.md examples/armalo-mission-control.html test && git commit -m "docs: define Armalo Editor ownership and mission"`

### Task 6: Full verification, local dogfood, and direct publication

**Files:**
- Verify all changed files and generated `dist/` output (not committed unless already tracked by repository policy)

- [ ] **Step 1: Run the full repository proof gate**

Run: `pnpm run check`

Expected: build, lint, Prettier, typecheck, all automated tests, and skill freshness check pass with zero failures.

- [ ] **Step 2: Install/link the local fork and verify AXI output**

Run: `pnpm link --global && armalo-editor --help`

Expected: the executable resolves as `armalo-editor`, emits the Armalo description and commands, and contains no user-facing `lavish-axi` command examples.

- [ ] **Step 3: Open the Mission Control demo and inspect the real browser**

Run: `armalo-editor examples/armalo-mission-control.html`

Use `chrome-devtools-axi snapshot`, screenshot, console, and network inspection. Confirm the tab title, wordmark, folded-paper mark, support label, responsive layout, lack of console errors, working annotation toggle, and functional feedback composer. Fix any proven issue through a new red-green test before continuing.

- [ ] **Step 4: Re-run full verification after dogfood fixes**

Run: `pnpm run check && git status --short --branch && git diff --check`

Expected: all checks pass; only intentional files are changed or committed.

- [ ] **Step 5: Commit any final proof fixes and push main**

Run: `git push -u origin main`

Expected: `origin/main` points to the verified Armalo rebrand commit series; `upstream/main` remains unchanged and push-disabled locally.

- [ ] **Step 6: Verify GitHub fork and repository metadata**

Use `gh-axi repo view` where supported and `gh repo view fongryan/armalo-editor --json nameWithOwner,isFork,parent,defaultBranchRef,url,description` as the fallback. Confirm the repository remains a fork of `kunchenguid/lavish-axi`, has the Armalo description, and exposes the verified default branch.
