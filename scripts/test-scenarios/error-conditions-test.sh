#!/bin/bash
# Purpose: Tests system behavior under error conditions
# Maintains steady rate of 50 requests/minute to error-generating endpoint
# Useful for testing error handling and monitoring

echo "⚠️ Starting Error Conditions Test (3 minute demo)"
start_time=$(date +%s)
duration=180  # 3 minutes total test duration

while [ $(( $(date +%s) - start_time )) -lt $duration ]; do
  sleep 1.2  # Steady rate: 50 requests per minute
  # Send request to error-generating endpoint
  kubectl exec -it $(kubectl get pod -l app=traffic-generator-pod -o jsonpath='{.items[0].metadata.name}') -- \
    wget -q -O- --tries=1 http://error-conditions-target-pod
done