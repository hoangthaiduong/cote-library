#!/usr/bin/env sh
set -eu
VERSION="6.4.299"
PROJECT_ROOT="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
VENDOR="$PROJECT_ROOT/vendor/pdfjs"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
ARCHIVE="$TMP/pdfjs-$VERSION-dist.zip"
URL="https://github.com/mozilla/pdf.js/releases/download/v$VERSION/pdfjs-$VERSION-dist.zip"
mkdir -p "$VENDOR"
printf 'Downloading official Mozilla PDF.js v%s…\n' "$VERSION"
if command -v curl >/dev/null 2>&1; then curl -fL "$URL" -o "$ARCHIVE"; else wget -O "$ARCHIVE" "$URL"; fi
unzip -q "$ARCHIVE" -d "$TMP/unpacked"
PDF_MODULE="$(find "$TMP/unpacked" -type f -name pdf.mjs -print -quit)"
WORKER_MODULE="$(find "$TMP/unpacked" -type f -name pdf.worker.mjs -print -quit)"
[ -n "$PDF_MODULE" ] && [ -n "$WORKER_MODULE" ] || { echo 'Official archive did not include the expected PDF.js files.' >&2; exit 1; }
cp "$PDF_MODULE" "$VENDOR/pdf.mjs"
cp "$WORKER_MODULE" "$VENDOR/pdf.worker.mjs"
for name in cmaps standard_fonts wasm; do
  DIR="$(find "$TMP/unpacked" -type d -name "$name" -print -quit)"
  if [ -n "$DIR" ]; then rm -rf "$VENDOR/$name"; cp -R "$DIR" "$VENDOR/$name"; fi
done
LICENSE="$(find "$TMP/unpacked" -type f -name LICENSE -print -quit)"
[ -z "$LICENSE" ] || cp "$LICENSE" "$VENDOR/LICENSE"
printf 'Mozilla PDF.js %s\nOfficial release: %s\nKeep pdf.mjs and pdf.worker.mjs on the same version.\n' "$VERSION" "$URL" > "$VENDOR/VERSION.txt"
printf 'PDF.js v%s installed in vendor/pdfjs/.\n' "$VERSION"
