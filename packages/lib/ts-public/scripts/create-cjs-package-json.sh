#!/usr/bin/env bash
set -euo pipefail

# This file copies the root package.json into the dist/cjs folder and changes
# the "type" field from "module" to "commonjs".

DEST="dist/cjs"
SRC_PKG="package.json"
DEST_PKG="$DEST/package.json"

# 1. ensure destination folder exists
mkdir -p "$DEST"

# 2. copy root package.json
cp "$SRC_PKG" "$DEST_PKG"

# 3. replace "type": "module"  →  "type": "commonjs"  (cross-platform sed)
if sed --version >/dev/null 2>&1; then             # GNU sed
  sed -i 's/"type":[[:space:]]*"module"/"type": "commonjs"/' "$DEST_PKG"
else                                               # BSD/macOS sed
  sed -i '' 's/"type":[[:space:]]*"module"/"type": "commonjs"/' "$DEST_PKG"
fi

echo "✔  Added dist/cjs/package.json with type=commonjs"