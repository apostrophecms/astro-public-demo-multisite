#!/bin/bash
# Test a URL and show status + key content info
# Usage: ./claude-tools/test-url.sh [URL]
URL="${1:-http://infraco.localhost:4321/}"
echo "=== $URL ==="
curl -s -o /tmp/test-url-body.html -w "HTTP %{http_code} (%{size_download} bytes, %{time_total}s)\n" "$URL"

# Show errors from backend log if 500
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$URL")
if [ "$STATUS" = "500" ]; then
  echo "--- Backend errors ---"
  tail -30 /tmp/backend.log | grep -A5 "error\|Error\|TypeError" 2>/dev/null | head -20
  echo "--- Frontend errors ---"
  tail -30 /tmp/frontend.log | grep -A5 "error\|Error" 2>/dev/null | head -20
fi
