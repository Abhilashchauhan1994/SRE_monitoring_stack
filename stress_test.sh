#!/bin/bash

# ------------------ Config ------------------
BASE_URL="http://localhost:5000"
TOTAL_REQUESTS=100        # how many per endpoint
CONCURRENCY=20            # parallel jobs

echo "🚀 Stress testing $BASE_URL"

# Function to hammer an endpoint
hammer() {
  local endpoint=$1
  local label=$2

  echo "🔹 Hitting $endpoint ($TOTAL_REQUESTS requests)..."
  seq 1 $TOTAL_REQUESTS | xargs -n1 -P$CONCURRENCY curl -s -o /dev/null -w "%{http_code}\n" "$BASE_URL$endpoint" \
    | sort | uniq -c | awk -v ep="$label" '{print ep, "->", $2, ":", $1}'
}

# Hit /api with random 200/400/500
hammer "/api" "API"

# Hit forced error endpoints
hammer "/error400" "ERROR400"
hammer "/error500" "ERROR500"

echo "✅ Stress test complete. Check Prometheus & Grafana dashboards."
