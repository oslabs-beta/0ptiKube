#!/bin/bash
# Purpose: Simulates normal daily traffic patterns over 5 minutes
# Baseline: 100 requests per minute
# Peak periods: 200 requests per minute during three peak windows

echo "📊 Starting Normal Operations Test (5 minute demo)"
start_time=$(date +%s)
duration=300  # 5 minutes total test duration

while [ $(( $(date +%s) - start_time )) -lt $duration ]; do
  current_time=$(( $(date +%s) - start_time ))
  # Create three peak traffic periods:
  # 1st peak: 1-1.5 minutes
  # 2nd peak: 2.5-3 minutes
  # 3rd peak: 4-5 minutes
  if [ $current_time -gt 60 ] && [ $current_time -lt 100 ] || \
     [ $current_time -gt 160 ] && [ $current_time -lt 200 ] || \
     [ $current_time -gt 260 ] && [ $current_time -lt 300 ]; then
    sleep 0.3  # Peak traffic: 200 requests/minute
  else
    sleep 0.6  # Baseline traffic: 100 requests/minute
  fi
  # Send request to normal operations endpoint
  kubectl exec -it $(kubectl get pod -l app=traffic-generator-pod -o jsonpath='{.items[0].metadata.name}') -- \
    wget -q -O- --tries=1 http://normal-ops-target-pod
done