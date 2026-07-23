#!/bin/bash
# Double-click this file to upload (push) the logo changes to GitHub.
# It uses YOUR Mac's GitHub login, which is why it can't be done from inside Claude.
cd "/Users/lizu/Documents/Claude/Projects/PowerToFly Ai/PowerToFly Ai/Explorations/round-04-synthesis" || exit 1
echo "Uploading the logo changes to GitHub (main)..."
echo ""
git push origin main
status=$?
echo ""
if [ $status -eq 0 ]; then
  echo "✅ Done! The logos are now on GitHub. You can close this window."
else
  echo "❌ Something went wrong (code $status). Take a screenshot and send it to Claude."
fi
echo ""
echo "Press any key to close."
read -n 1 -s
