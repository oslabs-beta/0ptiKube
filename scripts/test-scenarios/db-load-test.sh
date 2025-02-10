#!/bin/bash
echo "💾 Starting Database Load Test (4 minute demo)"
start_time=$(date +%s)
duration=240  # 4 minutes

while [ $(( $(date +%s) - start_time )) -lt $duration ]; do
  current_time=$(( $(date +%s) - start_time ))
  if [ $current_time -gt 120 ] && [ $current_time -lt 180 ]; then
    sleep 0.2  # Report generation: heavy load
  else
    sleep 1.2  # Normal: 50 transactions/minute
  fi
  kubectl exec -it $(kubectl get pod -l app=traffic-generator -o jsonpath='{.items[0].metadata.name}') -- \
    wget -q -O- --tries=1 http://db-load-target
done