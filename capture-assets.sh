#!/bin/bash
# Captures the social cover banners as PNG files using Chrome headless.
# Run from the project folder: bash capture-assets.sh

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
BASE="http://localhost:50514"
OUT="$(pwd)/exports"
mkdir -p "$OUT"

echo "Capturing LinkedIn cover (1584×396)..."
"$CHROME" --headless=new --screenshot="$OUT/linkedin-cover.png" \
  --window-size=1584,396 --hide-scrollbars \
  "$BASE/export-linkedin.html" 2>/dev/null
sleep 3

echo "Capturing Facebook cover (820×312)..."
"$CHROME" --headless=new --screenshot="$OUT/facebook-cover.png" \
  --window-size=820,312 --hide-scrollbars \
  "$BASE/export-facebook.html" 2>/dev/null
sleep 3

echo ""
echo "Done! Files saved to: $OUT"
ls -lh "$OUT"
