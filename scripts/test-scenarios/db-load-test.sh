#!/bin/bash
# Purpose: Simulates database traffic patterns over 4 minutes
# Normal phase: 50 transactions per minute
# Peak phase: Simulated report generation with increased load

echo "💾 Starting Database Load Test (4 minute demo)"
start_time=$(date +%s)
duration=240  # 4 minutes total test duration

while [ $(( $(date +%s) - start_time )) -lt $duration ]; do
  current_time=$(( $(date +%s) - start_time ))
  # Between 2-3 minutes: simulate heavy report generation
  if [ $current_time -gt 120 ] && [ $current_time -lt 180 ]; then
    sleep 0.2  # Faster requests: heavy load period
  else
    sleep 1.2  # Normal load: ~50 transactions per minute
  fi
  # Send request to database target pod
  kubectl exec -it $(kubectl get pod -l app=traffic-generator-pod -o jsonpath='{.items[0].metadata.name}') -- \
    wget -q -O- --tries=1 http://db-load-target-pod
done