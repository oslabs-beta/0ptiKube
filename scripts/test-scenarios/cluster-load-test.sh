#!/bin/bash
# Purpose: Simulates increasing cluster resource usage over 5 minutes
#
# Minikube Metrics Conversion Guide:
# CPU:
# - Minikube shows 'm' (millicores): 1000m = 1 full CPU core
# - Example: 500m = 0.5 cores, 2000m = 2 cores
#
# Memory:
# - Mi = Mebibytes (1Mi = 1.048576 MB)
# - Example: 256Mi ≈ 268MB, 1024Mi ≈ 1GB
#
# Resource Usage:
# - CPU%: (used cores / allocated cores) * 100
#   Example: Using 0.5 cores out of 3 = (0.5/3) * 100 = 16.7%
# - Memory%: (used MB / allocated MB) * 100
#   Example: Using 256Mi out of 1024Mi = (256/1024) * 100 = 25%

echo "🚀 Starting Cluster Load Test (5 minute demo)"
start_time=$(date +%s)
duration=300  # 5 minutes

while [ $(( $(date +%s) - start_time )) -lt $duration ]; do
  # First 2 minutes: normal load
  if [ $(( $(date +%s) - start_time )) -lt 120 ]; then
    echo "Normal load phase..."
    kubectl exec -it $(kubectl get pod -l app=traffic-generator-pod -o jsonpath='{.items[0].metadata.name}') -- \
      stress-ng --cpu 2 --cpu-method matrixprod --cpu-load 100 --taskset 0-1 --vm 1 --vm-bytes 256M --timeout 30s
    sleep 2
  else
    # Last 3 minutes: heavy load
    echo "Heavy load phase..."
    kubectl exec -it $(kubectl get pod -l app=traffic-generator-pod -o jsonpath='{.items[0].metadata.name}') -- \
      stress-ng --cpu 2 --cpu-method matrixprod --cpu-load 100 --taskset 0-1 --vm 2 --vm-bytes 512M --timeout 30s
    sleep 1
  fi
done

echo "🏁 Test completed!"