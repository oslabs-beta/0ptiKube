# 0ptiKube

A Next.js application with Kubernetes integration for local deployment and monitoring.

## Prerequisites
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

2. Make the scripts executable:
```bash
chmod +x ./0ptikube.sh
chmod +x ./scripts/protect-cluster-pods.sh
```

3. Enable pod and cluster protection (required for each new terminal session):
```bash
source ./scripts/protect-cluster-pods.sh
```

4. Run the main setup script:
```bash
./0ptikube.sh
```


## What the 0ptikube Script Does:

The 0ptiKube script performs the following operations:

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

5. **Safety Protections** (will delete once we implement the FE pod selection for deleting and the BE logic for delete)
   - Implements double confirmation for pod deletions
   - Adds warning messages for cluster operations
   - Protects against accidental cluster deletion
   - Provides detailed impact information before actions
   - Works with both zsh and bash shells
   - Session-specific protection (resets on terminal close)


## Development

- Access your app at `http://localhost:3000`
- Edit pages by modifying files in `src/app` directory
- Changes automatically reload in the browser
- Press `Ctrl+C` to stop the development environment

## During Development process do not add these files to .gitignore. We will remove
before production app is ready to showcase
1. README-v2.md - Contains important setup and usage instructions
2. .package-hash - Used by the development script to track dependencies
3. dockerfile.dev - Required for the development container setup
4. Scripts in the scripts/ directory - Contains the protection features


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

- **Updating Dependencies**
  - Pull latest changes
  - Script will automatically rebuild if package.json changes

- **Cleaning Up**
  - Script handles cleanup on Ctrl+C
  - Manual cleanup: `docker stop 0ptikube-dev`



### The following are useful commands for the team to use in development
- **Will delete before it goes in production**

### Useful Docker Commands
```bash
# List running containers
docker ps

# List all containers (including stopped)
docker ps -a

# List all images
docker images

### Container Data Management
```bash
# Stop and remove container (safe to do)
docker stop 0ptikube-dev
docker rm 0ptikube-dev

# Your data is preserved because:
# - Source code is mounted from your local directory
# - Kubernetes configs are stored locally
# - Container is just running the development environment
# Restart development environment
./0ptikube.sh

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






## Useful Commands when playing with minikube

### Minikube Cluster Management
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

### Prometheus & Monitoring useful commands
```bash
# Check Prometheus deployment
helm list

# Get Prometheus pod status
kubectl get pods -l app=prometheus

# Get Grafana pod status
kubectl get pods -l app=grafana
```




## Contributing

1. Fork the repository
2. Create your feature branch
3. Submit a pull request

## License

MIT License
```

