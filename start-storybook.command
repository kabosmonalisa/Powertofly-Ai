#!/bin/zsh
# ─────────────────────────────────────────────────────────────
# PowerToFly AI — Storybook launcher
# Double-click this file to start the storybook server.
# Leave the window it opens OPEN; press Ctrl-C in it to stop.
# ─────────────────────────────────────────────────────────────

# Load your shell env so ANTHROPIC_API_KEY (if you set one) is picked up.
[ -f "$HOME/.zshenv" ] && source "$HOME/.zshenv" 2>/dev/null
[ -f "$HOME/.zshrc" ]  && source "$HOME/.zshrc"  2>/dev/null

# Work from this file's folder no matter where it's launched from.
cd "$(dirname "$0")" || { echo "Couldn't find the project folder."; exit 1; }

echo "──────────────────────────────────────────────"
echo "  PowerToFly AI — Storybook"
echo "  Folder: $(pwd)"
echo "──────────────────────────────────────────────"

# Stop any storybook server already running on this port, so we don't clash.
pkill -f "ds/server.py 3456" 2>/dev/null && echo "· Stopped the previous server."
sleep 0.6

# Tell you whether AI reading is on.
if [ -n "$ANTHROPIC_API_KEY" ]; then
  echo "· ✅ AI reading is ON (ANTHROPIC_API_KEY found)."
else
  echo "· ⚠️  AI reading is OFF — no ANTHROPIC_API_KEY set."
  echo "     The storybook works fine; Create just uses the built-in rules reader."
  echo "     To turn AI reading on: add your key to ~/.zshrc, then reopen this."
fi

# Open the storybook in your browser once the server is up (optional — delete
# these two lines if you only ever use the Claude side panel).
( sleep 1.5; open "http://localhost:3456/ds/storybook.html" ) &

echo ""
echo "· Starting the server…  URL: http://localhost:3456/ds/storybook.html"
echo "· Leave this window open. Press Ctrl-C here to stop the server."
echo ""

# exec: the server takes over this window and shows its logs.
exec python3 ds/server.py 3456
