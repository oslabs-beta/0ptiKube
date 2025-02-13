#!/bin/bash
# Purpose: CPU-intensive test using prime number calculations
# Uses stress-ng to generate CPU load through prime number computation
# Runs for 3 minutes with continuous prime calculations

echo "🧮 Starting Prime Calculation Test (3 minute demo)"
start_time=$(date +%s)
duration=180  # 3 minutes total test duration

while [ $(( $(date +%s) - start_time )) -lt $duration ]; do
  echo "Running prime calculations..."
  kubectl exec -it $(kubectl get pod -l app=traffic-generator-pod -o jsonpath='{.items[0].metadata.name}') -- \
    stress-ng --cpu 2 --cpu-method prime --cpu-load 100 --taskset 0-1 --timeout 30s
  sleep 2
done

echo "🏁 Prime calculation test completed!"