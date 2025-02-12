# 0ptiKube

A Next.js application with Kubernetes integration for local deployment and monitoring.

## Table of Contents
- [Prerequisites](#prerequisites)
- [QuickStart](#quickstart)
- [Features](#features)
  - [Script Operations](#script-operations)
  - [Safety Protections](#safety-protections)
- [Development](#development)
- [Troubleshooting](#troubleshooting)
- [Maintenance](#maintenance)
- [Command Reference](#command-reference)
  - [Docker Commands](#docker-commands)
  - [Minikube Commands](#minikube-commands)
  - [Pod Management](#pod-management)
  - [Cluster Information](#cluster-information)
  - [Prometheus & Monitoring](#prometheus--monitoring)
- [Test Scenarios](#test-scenarios)

## Table of Contents
- [Prerequisites](#prerequisites)
- [QuickStart](#quickstart)
- [Features](#features)
  - [Script Operations](#script-operations)
  - [Safety Protections](#safety-protections)
- [Development](#development)
- [Troubleshooting](#troubleshooting)
- [Maintenance](#maintenance)
- [Command Reference](#command-reference)
  - [Docker Commands](#docker-commands)
  - [Minikube Commands](#minikube-commands)
  - [Pod Management](#pod-management)
  - [Cluster Information](#cluster-information)
  - [Prometheus & Monitoring](#prometheus--monitoring)
- [Test Scenarios](#test-scenarios)

## Prerequisites

Before getting started, ensure you have:

Before getting started, ensure you have:
- Git
- Docker Desktop
- Container Runtime (Script will install):
  - macOS: hyperkit (lightweight virtualization if no docker desktop is installed)
  - Linux: docker driver (default)

## QuickStart


1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/0ptiKube.git
   cd 0ptiKube
   ```
   ```bash
   git clone https://github.com/your-username/0ptiKube.git
   cd 0ptiKube
   ```

2. Make the scripts executable:
   ```bash
   chmod +x ./0ptikube.sh
   chmod +x ./scripts/protect-cluster-pods.sh
   ```
   ```bash
   chmod +x ./0ptikube.sh
   chmod +x ./scripts/protect-cluster-pods.sh
   ```

3. Enable pod and cluster protection (required for each new terminal session):
   ```bash
   source ./scripts/protect-cluster-pods.sh
   ```
   ```bash
   source ./scripts/protect-cluster-pods.sh
   ```

4. Run the main setup script:
   ```bash
   ./0ptikube.sh
   ```
   ```bash
   ./0ptikube.sh
   ```

## Features
## Features

### Script Operations
### Script Operations

1. **System Detection**
   - Identifies your operating system (macOS/Linux)
   - Displays colorful progress indicators
   - Shows ASCII art welcome banner

2. **Dependency Management**
   - Checks for Docker installation
   - For macOS: Installs/verifies Homebrew
   - Installs required tools (minikube, kubectl, helm)
   - Manages Node.js dependencies in container

3. **Environment Setup**
   - Starts Minikube cluster if not running
   - Configures Prometheus monitoring
   - Sets up development container
   - Enables hot reloading

4. **Container Management**
   - Builds development container
   - Mounts local files for live updates
   - Manages container lifecycle
   - Handles graceful cleanup on exit

### Safety Protections
> Note: Will be removed once we implement the FE pod selection for deleting and the BE logic for delete

- Implements double confirmation for pod deletions
- Adds warning messages for cluster operations
- Protects against accidental cluster deletion
- Provides detailed impact information before actions
- Works with both zsh and bash shells
- Session-specific protection (resets on terminal close)
### Safety Protections
> Note: Will be removed once we implement the FE pod selection for deleting and the BE logic for delete

- Implements double confirmation for pod deletions
- Adds warning messages for cluster operations
- Protects against accidental cluster deletion
- Provides detailed impact information before actions
- Works with both zsh and bash shells
- Session-specific protection (resets on terminal close)

## Development

### Basic Usage
### Basic Usage
- Access your app at `http://localhost:3000`
- Edit pages by modifying files in `src/app` directory
- Changes automatically reload in the browser
- Press `Ctrl+C` to stop the development environment

### Important Development Files
Do not add these files to .gitignore during development:
1. `README-v2.md` - Contains important setup and usage instructions
2. `.package-hash` - Used by the development script to track dependencies
3. `dockerfile.dev` - Required for the development container setup
4. Scripts in the `scripts/` directory - Contains the protection features
### Important Development Files
Do not add these files to .gitignore during development:
1. `README-v2.md` - Contains important setup and usage instructions
2. `.package-hash` - Used by the development script to track dependencies
3. `dockerfile.dev` - Required for the development container setup
4. Scripts in the `scripts/` directory - Contains the protection features

## Troubleshooting

### Common Issues

1. **Script Permission Error**
   ```bash
   -bash: ./0ptikube.sh: Permission denied
   ```
   Solution: Run `chmod +x ./0ptikube.sh`

2. **Docker Not Running**
   ```bash
   Cannot connect to the Docker daemon
   ```
   Solution: 
   - Start Docker Desktop
   - Wait for Docker to fully initialize
   - Try running the script again

3. **Port Already in Use**
   ```bash
   Error: Port 3000 already in use
   ```
   Solution: 
   - Find and stop the process using port 3000
   - Or modify the port in dockerfile.dev

4. **Minikube Issues**
   ```bash
   minikube start failed
   ```
   Solution:
   - Ensure virtualization is enabled
   - Check system resources
   - Try `minikube delete` and run script again

5. **Homebrew Installation Failed (macOS)**
   ```bash
   Failed to install homebrew
   ```
   Solution:
   - Check internet connection
   - Run `xcode-select --install`
   - Try manual Homebrew installation

6. **Container Build Fails**
   ```bash
   Error building development container
   ```
   Solution:
   - Check Docker disk space
   - Verify dockerfile.dev syntax
   - Try `docker system prune` to clear space

## Maintenance

### Updating Dependencies
- Pull latest changes
- Script will automatically rebuild if package.json changes
### Updating Dependencies
- Pull latest changes
- Script will automatically rebuild if package.json changes

### Cleaning Up
- Script handles cleanup on Ctrl+C
- Manual cleanup: `docker stop 0ptikube-dev`
### Cleaning Up
- Script handles cleanup on Ctrl+C
- Manual cleanup: `docker stop 0ptikube-dev`

## Command Reference
## Command Reference

### Docker Commands
### Docker Commands
```bash
# List running containers
docker ps

# List all containers (including stopped)
docker ps -a

# List all images
docker images

# Stop and remove container (safe to do)
docker stop 0ptikube-dev
docker rm 0ptikube-dev

# Remove the development container
docker rm 0ptikube-dev

# Remove the development image
docker rmi 0ptikube-dev

# View container logs
docker logs 0ptikube-dev

# Enter running container shell
docker exec -it 0ptikube-dev /bin/bash

# Check container resource usage
docker stats 0ptikube-dev

# Clean up unused resources
docker system prune  # Remove unused containers, networks, images
docker system prune -a  # Remove all unused images too
```

### Minikube Commands
```

### Minikube Commands
```bash
# Check cluster status
minikube status

# Start cluster
minikube start

# Stop cluster (with protection)
minikube stop

# Delete cluster (with protection)
minikube delete

# Access minikube dashboard
minikube dashboard
```

### Pod Management
```bash
# List all pods in all namespaces
kubectl get pods -A

# List pods in default namespace
kubectl get pods

# List pods in specific namespace
kubectl get pods -n kube-system

# Get detailed information about a specific pod
kubectl describe pod <pod-name> -n <namespace>

# Get pod logs
kubectl logs <pod-name> -n <namespace>

# Delete a pod (with protection)
kubectl delete pod <pod-name> -n <namespace>

# Watch pod status in real-time
kubectl get pods -A --watch
```

### Cluster Information
```bash
# Get cluster information
kubectl cluster-info

# Get node information
kubectl get nodes

# Get all resources in all namespaces
kubectl get all -A

# Get namespace information
kubectl get namespaces
```

### Prometheus & Monitoring
### Prometheus & Monitoring
```bash
# Check Prometheus deployment
helm list

# Get Prometheus pod status
kubectl get pods -l app=prometheus

# Get Grafana pod status
kubectl get pods -l app=grafana
```

## Test Scenarios

### Before Running Tests
Make test scripts executable:
```bash
chmod +x ./scripts/test-scenarios/*.sh
```

### Available Test Scenarios

#### 1. Launch Day Test (5 minutes total)
```bash
./scripts/test-scenarios/launch-day-test.sh
```
**Traffic Pattern:**
- First 2 minutes: Normal load (100 requests/minute)
- Last 3 minutes: Flash sale spike (1000 requests/minute)
- Total duration: 300 seconds

#### 2. Normal Operations Test
```bash
./scripts/test-scenarios/normal-ops-test.sh
```
**Traffic Pattern:**
- Single request test
- Verifies basic connectivity
- Duration: Instant (single request)

#### 3. Error Conditions Test (3 minutes total)
```bash
./scripts/test-scenarios/error-conditions-test.sh
```
**Traffic Pattern:**
- Consistent load: 50 requests/minute
- Tests resource constraints
- Total duration: 180 seconds

#### 4. Database Load Test (4 minutes total)
```bash
./scripts/test-scenarios/db-load-test.sh
```
**Traffic Pattern:**
- Minutes 0-2: Normal load (50 transactions/minute)
- Minutes 2-3: Heavy load period
- Minutes 3-4: Return to normal load
- Total duration: 240 seconds

### Monitoring Test Execution
Open three terminal windows:

1. Watch pod status:
   ```bash
   kubectl get pods -w
   ```

2. View pod logs (replace SCENARIO with: launch-day, normal-ops, error-conditions, or db-load):
   ```bash
   kubectl logs -f -l app=SCENARIO
   ```

3. Run the test scripts in this terminal


Yes, I'll update the <mcfile name="README.md" path="/Users/oliverfajardo/repos/codesmith_projects/0ptiKube/README.md"></mcfile> to clearly specify all the ports. Here's the modified section:

```markdown:/Users/oliverfajardo/repos/codesmith_projects/0ptiKube/README.md
### Guide for using 0ptikube setup until test script execution 
1. First, let's make the scripts executable:
```bash
chmod +x ./0ptikube.sh
chmod +x ./scripts/protect-cluster-pods.sh
```

2. Enable pod protection (required for safety):
```bash
source ./scripts/protect-cluster-pods.sh
```

3. Start the environment:
```bash
./0ptikube.sh
```
Wait for the script to complete setup (includes minikube, prometheus, and development container)
- Next.js application will be available at: http://localhost:3000

4. Verify everything is running:
```bash
# Check minikube status
minikube status

# Check all pods are running
kubectl get pods -A

# Verify test pods are ready
kubectl get pods -l 'app in (db-load,error-conditions,launch-day,normal-ops)'
```

5. Set up monitoring access:

For Grafana Dashboard:
```bash
kubectl port-forward svc/my-kube-prometheus-stack-grafana 3001:80
```
Visit http://localhost:3001
- Username: admin
- Password: prom-operator

For Prometheus Dashboard:
```bash
kubectl port-forward svc/prometheus-operated 9090:9090
```
Visit http://localhost:9090

6. Set up monitoring windows (open 3 terminal windows):

Terminal 1 - Watch pod status:
```bash
kubectl get pods -w
```

Terminal 2 - Watch pod logs:
```bash
kubectl logs -f -l app=launch-day  # Replace 'launch-day' with scenario name
```

Terminal 3 - Monitor resource usage:
```bash
kubectl top pods --containers
```

7. Make test scripts executable:
```bash
chmod +x ./scripts/test-scenarios/*.sh
```

8. Run test scenarios:
Choose one of the following test scripts:
```bash
# Launch Day Test (5 minutes)
./scripts/test-scenarios/launch-day-test.sh

# Normal Operations Test
./scripts/test-scenarios/normal-ops-test.sh

# Error Conditions Test (3 minutes)
./scripts/test-scenarios/error-conditions-test.sh

# Database Load Test (4 minutes)
./scripts/test-scenarios/db-load-test.sh
```

9. Monitor results:
- Watch Terminal 1 for pod status changes
- Check Terminal 2 for real-time logs
- Monitor Terminal 3 for resource usage
- View detailed metrics in Grafana (http://localhost:3001)
- Check raw metrics in Prometheus (http://localhost:9090)

10. Clean up after testing:
```bash
# Stop the current test (if running)
Ctrl+C

# Clean up port forwards (if needed)
pkill -f "kubectl port-forward"
```
```

