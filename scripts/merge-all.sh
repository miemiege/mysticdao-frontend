#!/bin/bash
# MysticDao v5.0 Agent Branch Merge Script
# Usage: bash scripts/merge-all.sh

set -e

echo "═══════════════════════════════════════════════════════"
echo "  MysticDao v5.0 — Agent Branch Merge & Deploy"
echo "═══════════════════════════════════════════════════════"

BRANCHES=(
  "agent-5e-performance"
  "agent-5a-home-visual"
  "agent-5b-talisman-share"
  "agent-5c-daily-scroll"
  "agent-5d-social"
)

cd "$(dirname "$0")/.."

echo ""
echo "Step 0: Fetch all branches..."
git fetch origin

echo ""
echo "Step 1: Checkout v5.0-rebuild baseline..."
git checkout v5.0-rebuild
git pull origin v5.0-rebuild

# Check each branch exists
MISSING=0
for b in "${BRANCHES[@]}"; do
  if git show-ref --verify --quiet "refs/remotes/origin/$b"; then
    echo "  ✓ $b"
  else
    echo "  ✗ $b MISSING"
    MISSING=1
  fi
done

if [ $MISSING -eq 1 ]; then
  echo ""
  echo "Some branches missing. Aborting."
  exit 1
fi

echo ""
echo "Step 2: Merge branches in order..."
for b in "${BRANCHES[@]}"; do
  echo ""
  echo "  → Merging $b..."
  if git merge "origin/$b" --no-edit; then
    echo "    ✓ merged"
  else
    echo "    ✗ CONFLICT — resolve manually:"
    echo "      git add -A && git merge --continue"
    exit 1
  fi
done

echo ""
echo "Step 3: Type check..."
npx tsc --noEmit

echo ""
echo "Step 4: Build..."
npm run build

echo ""
echo "Step 5: Bundle size check..."
JS_FILE=$(ls -S dist/assets/*.js | head -1)
JS_SIZE=$(du -h "$JS_FILE" | cut -f1)
echo "  JS: $JS_SIZE"
if command -v gzip &> /dev/null; then
  GZ_SIZE=$(gzip -c "$JS_FILE" | wc -c | awk '{printf "%.0f", $1/1024}')
  echo "  JS gzip: ${GZ_SIZE}KB"
  if [ "$GZ_SIZE" -gt 500 ]; then
    echo "  ⚠ WARNING: Bundle > 500KB gzip"
  fi
fi

echo ""
echo "Step 6: Tag v5.0.0..."
git tag -f v5.0.0
git push origin v5.0.0 --force-with-lease

echo ""
echo "Step 7: Deploy to GitHub Pages..."
npx gh-pages -d dist

echo ""
echo "═══════════════════════════════════════════════════════"
echo "  ✅ MERGE & DEPLOY COMPLETE"
echo "  https://miemiege.github.io/mysticdao-frontend/"
echo "═══════════════════════════════════════════════════════"
