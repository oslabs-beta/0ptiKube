# Minikube Environment Setup
This guide provides instructions for setting up a Minikube environment with test pods, service monitors, and cronjobs for stress testing and monitoring.

## 1. Minikube Environment Setup
A. After running the minikubeInstall.sh script, copy and paste commands in this codeblock all together into a terminal and eexecute them.
```bash
# Start Minikube with sufficient resources
minikube start 
# Verify Minikube is running and view configuration
minikube status
minikube config view #cpu should be 3, and memory 3000
# Enable required addons
minikube addons enable metrics-server  # Aggregates resource usage data for monitoring and autoscaling.
minikube addons enable dashboard        # Provides a default storage class for dynamic volume provisioning.
minikube addons enable ingress          # Manages external access to services via HTTP/HTTPS routing.
minikube addons enable storage-provisioner # Enables dynamic provisioning of storage for persistent volumes.
```
B. Next, copy and paste this code block into the same terminal and execute commands. This applies the RBAC, pod configuration, service and cron jobs copy and pasting the commands below.
```bash
kubectl apply -f k8s/stressor-rbac.yaml
kubectl apply -f k8s/test-pod1.yaml
kubectl apply -f k8s/test-pod1-service-monitor.yaml
kubectl apply -f k8s/test-pod1-cronjob.yaml
kubectl apply -f k8s/test-pod2.yaml
kubectl apply -f k8s/test-pod2-service-monitor.yaml
kubectl apply -f k8s/test-pod2-cronjob.yaml
kubectl apply -f k8s/test-pod3.yaml
kubectl apply -f k8s/test-pod3-service-monitor.yaml
kubectl apply -f k8s/test-pod3-cronjob.yaml
# Verify all resources are created:
kubectl get deployments,pods,cronjobs,servicemonitors
```

C. Open a new terminal tab, and execute the port-forward statement below. Keep this terminal tab open, and uninterrupted as long as you're running the 0ptikube web app.
```bash
kubectl port-forward svc/my-kube-prometheus-stack-prometheus 9090:9090
```

D. After completing steps A-C, you are now ready to view the pods being tested by our cronjob by executing the command below. The cpu and memory of testpods1-3 will be under stress.

```bash
# new terminal - shows each test pod's cpu and memory changes along with the cronjob associated with pod, titles stressor
watch "kubectl top pods | grep -E 'test-pod1|test-pod2|test-pod3'"
```
