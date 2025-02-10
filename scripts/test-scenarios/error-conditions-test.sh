#!/bin/bash
echo "⚠️ Starting Error Conditions Test (3 minute demo)"
start_time=$(date +%s)
duration=180  # 3 minutes

while [ $(( $(date +%s) - start_time )) -lt $duration ]; do
  sleep 1.2  # Steady 50 requests/minute
  kubectl exec -it $(kubectl get pod -l app=traffic-generator -o jsonpath='{.items[0].metadata.name}') -- \
    wget -q -O- --tries=1 http://error-conditions-target
done