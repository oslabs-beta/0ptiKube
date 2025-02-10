#!/bin/bash
echo "🚀 Starting Launch Day Test Scenario (5 minute demo)"
start_time=$(date +%s)
duration=300  # 5 minutes

while [ $(( $(date +%s) - start_time )) -lt $duration ]; do
  # First 2 minutes: normal load (100 req/min)
  if [ $(( $(date +%s) - start_time )) -lt 120 ]; then
    sleep 0.6  # ~100 requests per minute
  else
    # Last 3 minutes: flash sale spike (1000 req/min)
    sleep 0.06  # ~1000 requests per minute
  fi
  kubectl exec -it $(kubectl get pod -l app=traffic-generator -o jsonpath='{.items[0].metadata.name}') -- \
    wget -q -O- --tries=1 http://launch-day-target
done