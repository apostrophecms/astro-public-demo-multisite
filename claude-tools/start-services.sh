#!/bin/bash
# Start backend and frontend services for development
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

# Kill any existing instances
pkill -f "nodemon" 2>/dev/null
pkill -f "astro dev" 2>/dev/null
sleep 1

cd "$PROJECT_ROOT/backend" && npm run dev > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
cd "$PROJECT_ROOT/frontend" && npm run dev > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!

echo "Backend PID: $BACKEND_PID (log: /tmp/backend.log)"
echo "Frontend PID: $FRONTEND_PID (log: /tmp/frontend.log)"
echo "Waiting for services..."

for i in $(seq 1 60); do
  BACK=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 1 http://localhost:3000/ 2>/dev/null)
  FRONT=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 1 http://localhost:4321/ 2>/dev/null)
  if [ "$BACK" != "000" ] && [ "$FRONT" != "000" ]; then
    echo "Both services up (backend: $BACK, frontend: $FRONT) after ${i}s"
    exit 0
  fi
  sleep 1
done
echo "Timed out waiting for services"
exit 1
