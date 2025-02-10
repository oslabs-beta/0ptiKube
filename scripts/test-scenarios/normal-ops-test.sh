#!/bin/bash
echo "📊 Starting Normal Operations Test (5 minute demo)"
start_time=$(date +%s)
duration=300  # 5 minutes

while [ $(( $(date +%s) - start_time )) -lt $duration ]; do
  current_time=$(( $(date +%s) - start_time ))
  # Create three peaks during the demo
  if [ $current_time -gt 60 ] && [ $current_time -lt 100 ] || \
     [ $current_time -gt 160 ] && [ $current_time -lt 200 ] || \
     [ $current_time -gt 260 ] && [ $current_time -lt 300 ]; then
    sleep 0.3  # Peak: 200 requests/minute
  else
    sleep 0.6  # Baseline: 100 requests/minute
  fi
  kubectl exec -it $(kubectl get pod -l app=traffic-generator -o jsonpath='{.items[0].metadata.name}') -- \
    wget -q -O- --tries=1 http://normal-ops-target
done