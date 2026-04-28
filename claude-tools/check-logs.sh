#!/bin/bash
# Show recent errors from backend and frontend logs
# Usage: ./claude-tools/check-logs.sh [lines]
LINES="${1:-30}"
echo "=== Backend (last $LINES lines with errors) ==="
tail -"$LINES" /tmp/backend.log 2>/dev/null | grep -B1 -A3 "error\|Error\|TypeError\|⚠" || echo "(no errors)"
echo ""
echo "=== Frontend (last $LINES lines with errors) ==="
tail -"$LINES" /tmp/frontend.log 2>/dev/null | grep -B1 -A3 "error\|Error\|500" || echo "(no errors)"
