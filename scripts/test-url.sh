#!/bin/bash
# Usage: ./scripts/test-url.sh URL
# Fetches the URL and shows status code, headers, and body excerpt
URL="${1:-http://infraco.localhost:4321/}"
echo "Testing: $URL"
echo "---"
curl -s -o /tmp/test-url-body.html -w "HTTP %{http_code} (%{size_download} bytes, %{time_total}s)\n" "$URL"
echo "---"
# Show first 100 lines, or error content
head -100 /tmp/test-url-body.html
