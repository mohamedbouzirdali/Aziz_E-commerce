#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PORT="${ELAN_AUTH_TEST_PORT:-3100}"
BASE_URL="http://127.0.0.1:$PORT"
LOG_FILE="$(mktemp "${TMPDIR:-/tmp}/elan-auth.XXXXXX.log")"
ADMIN_HTML="$(mktemp "${TMPDIR:-/tmp}/elan-admin.XXXXXX.html")"
ACCOUNT_HTML="$(mktemp "${TMPDIR:-/tmp}/elan-account.XXXXXX.html")"

cleanup() {
  if [[ -n "${SERVER_PID:-}" ]]; then
    kill "$SERVER_PID" >/dev/null 2>&1 || true
    wait "$SERVER_PID" >/dev/null 2>&1 || true
  fi
  rm -f "$LOG_FILE" "$ADMIN_HTML" "$ACCOUNT_HTML"
}

trap cleanup EXIT

cd "$ROOT_DIR"

if [[ ! -f "$ROOT_DIR/.next/BUILD_ID" ]]; then
  npm run build
fi

npm run start -- -p "$PORT" >"$LOG_FILE" 2>&1 &
SERVER_PID=$!

for _ in {1..40}; do
  if curl -fsS "$BASE_URL/account" >"$ACCOUNT_HTML" 2>/dev/null; then
    break
  fi
  sleep 0.25
done

if ! kill -0 "$SERVER_PID" >/dev/null 2>&1; then
  cat "$LOG_FILE" >&2
  exit 1
fi

if ! rg -q "Your account" "$ACCOUNT_HTML"; then
  echo "Signed-out account page did not render the authentication experience." >&2
  exit 1
fi

curl -fsS "$BASE_URL/admin" >"$ADMIN_HTML"

if rg -q "Admin workspace|Commerce overview|Live database total" "$ADMIN_HTML"; then
  echo "Protected admin content leaked in the signed-out response." >&2
  exit 1
fi

if ! rg -q "sign-in-required|NEXT_REDIRECT" "$ADMIN_HTML"; then
  echo "The signed-out admin response did not contain its redirect boundary." >&2
  exit 1
fi

CONFIRM_HEADERS="$(curl -sS -D - -o /dev/null "$BASE_URL/auth/confirm")"

if ! printf '%s' "$CONFIRM_HEADERS" | rg -q "^HTTP/1\\.1 307"; then
  echo "Invalid confirmation links must redirect." >&2
  exit 1
fi

if ! printf '%s' "$CONFIRM_HEADERS" | rg -q \
  "^location: https?://[^/]+/account\\?notice=confirmation-failed"; then
  echo "Invalid confirmation links must return to the account page." >&2
  exit 1
fi

echo "Authentication route boundaries verified successfully."
