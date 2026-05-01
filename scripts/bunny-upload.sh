#!/usr/bin/env bash
# Upload all /tmp/bunny/*.webp to Bunny storage zone leave-mold under /library/
# Auth + endpoint are passed in env so the password never lands in git.
set -euo pipefail
ZONE="${BUNNY_ZONE:-leave-mold}"
HOST="${BUNNY_HOST:-ny.storage.bunnycdn.com}"
KEY="${BUNNY_KEY:?Set BUNNY_KEY env var}"
SRC_DIR="${SRC_DIR:-/tmp/bunny}"
PREFIX="${PREFIX:-library/}"

ok=0; fail=0
for f in "$SRC_DIR"/*.webp; do
  base=$(basename "$f")
  url="https://${HOST}/${ZONE}/${PREFIX}${base}"
  status=$(curl --http1.1 -s -o /dev/null -w "%{http_code}" -X PUT \
    -H "AccessKey: ${KEY}" \
    -H "Content-Type: image/webp" \
    --data-binary "@${f}" \
    "${url}")
  if [[ "$status" =~ ^2 ]]; then
    echo "OK  ${status}  ${url}"
    ok=$((ok+1))
  else
    echo "ERR ${status}  ${url}"
    fail=$((fail+1))
  fi
done
echo "---"
echo "uploaded=${ok}  failed=${fail}"
