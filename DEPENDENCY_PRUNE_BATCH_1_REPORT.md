# DEPENDENCY PRUNE BATCH 1 — NETWORK BLOCKED REPORT

## 1. Scope check
- **Status:** ✅ PASSED
- **Branch:** `prune/dependency-batch-1`
- **Removed packages:** 17 (exactly Batch 1)
- **Added packages:** 0
- **Changed versions:** 0
- **Extra removed:** 0 (none)
- **Approved still present:** 0
- **package.json valid:** ✅
- **Diff:** `-17 lines`, `114 deps` (from 131)

## 2. Removed packages
| Package | Reason |
|---|---|
| `@apollo/client` | No import, no config |
| `@graphql-codegen/introspection` | No import, no config |
| `@stripe/stripe-react-native` | No import, native-only |
| `expo-av` | No import |
| `expo-audio` | No import |
| `expo-camera` | No import, native-only |
| `expo-gl` | No import, native-only |
| `expo-location` | No import, native-only |
| `expo-video` | No import |
| `graphql` | No import |
| `immutable` | No import |
| `lucide-react-native` | No import |
| `nativewind` | No import, no babel config |
| `react-native-maps` | No import, native-only |
| `react-native-webrtc` | No import |
| `snack-content` | No import, Expo Snack artifact |
| `react-string-replace` | No import |

## 3. pnpm install — NETWORK BLOCKER
| Attempt | Command | Result |
|---|---|---|
| 1/3 | `pnpm install --no-frozen-lockfile` | ⏰ timeout 600s (117 resolved, 0 downloaded) |
| 2/3 | `pnpm install --no-frozen-lockfile` | ⏰ timeout 600s (identical) |
| 3/3 | Skipped per rule | — |

## 4. Lockfile-only sync
Tried as alternative to full install.

| Attempt | Command | Result |
|---|---|---|
| 1/2 | `pnpm install --lockfile-only --no-frozen-lockfile --ignore-scripts --prefer-offline` | ⏰ timeout 300s — ECONNRESET on registry.npmjs.org (glob, yargs, plist, expo/plist) |
| 2/2 | `pnpm install --lockfile-only --no-frozen-lockfile --ignore-scripts --offline` | ❌ `ERR_PNPM_NO_OFFLINE_META` for `expo-keep-awake@>=14.1.4` — metadata missing from local cache |

**Result:** lockfile NOT synced. Cannot commit `package.json` alone.

**Root cause:** VPS network ECONNRESET to `registry.npmjs.org`. Local pnpm store has partial metadata (downloaded from previous npm usage) but lacks metadata for Expo 53 package tree.

## 5. Verification without install
- **package.json:** ✅ valid JSON, `114 deps`
- **Diff:** ✅ only 17 Batch 1 lines removed
- **pnpm-lock.yaml:** ✅ unchanged (no install, no sync)
- **No other files modified:** ✅

## 6. lint and web — skipped
- `npm run lint` — skipped: needs node_modules, install blocked by ECONNRESET
- `EXPO_OFFLINE=1 CI=1 timeout 10s pnpm web` — skipped: needs node_modules, install blocked by ECONNRESET

## 7. Blocked actions (post-install)
- `npm run lint` — needs node_modules
- `EXPO_OFFLINE=1 CI=1 timeout 10s pnpm web` — needs node_modules
- Commit + push + PR — cannot lockfile-sync without install

## 6. Next steps when network stable
```bash
cd /home/hermes/work/zerkalo-onspace-prune-1
pnpm install --no-frozen-lockfile           # sync lockfile
npm run lint                                 # check no breakage
EXPO_OFFLINE=1 CI=1 timeout 10s pnpm web     # quick web test

git add package.json pnpm-lock.yaml
git commit -m "prune: remove Batch 1 unused dependencies (17 packages)"
git push -u origin prune/dependency-batch-1
gh pr create --title "prune: remove Batch 1 unused dependencies" ...
```

## 7. Alternate approach if network stays unstable
```bash
cd /opt/zerkalo                           # production repo
cp package.json /home/hermes/work/zerkalo-onspace-prune-1/
# Then copy node_modules from production (npm-based, may not match pnpm)
# OR: npm install in prune dir (uses production's package-lock.json)
```

## Final publish note

This final PR was completed by Hermes after Codex produced the dependency-prune patch but could not publish it to GitHub due HTTPS tunnel 403.

Final method:
- Hermes used a fresh clone.
- Hermes applied the preserved package.json Batch 1 diff.
- Scope check passed: exactly 17 approved Batch 1 dependencies removed.
- Protected packages remained present.
- pnpm-lock.yaml was synchronized using a temporary session-only registry mirror:
  env npm_config_registry=https://registry.npmmirror.com
- No global registry config was changed.
- Mirror URL check passed before commit.
- Production was not touched.
