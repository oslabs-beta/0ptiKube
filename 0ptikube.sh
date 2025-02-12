#!/bin/bash
# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Define print functions first
print_step() {
    echo -e "\n${BLUE}=== 🔄 $1 ===${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Then check for protection script
if [ -f "./scripts/protect-cluster-pods.sh" ]; then
    source ./scripts/protect-cluster-pods.sh
    print_success "Pod and cluster protection enabled"
else
    print_error "Protection script not found"
    exit 1
fi

NEXTJS_PORT=3000
GRAFANA_PORT=3001
PROMETHEUS_PORT=9090

CONTAINER_NAME="0ptikube-dev"
PACKAGE_HASH_FILE=".package-hash"

# Enable Docker BuildKit for better build performance
export DOCKER_BUILDKIT=1

#The script will automatically source the protection, 
# so you don't need to run source ./scripts/protect-cluster-pods.sh
# Every time you run ./0ptikube.sh , protection is automatically enabled
# No need to manually source the protection script
# Protection works only in the terminal where you run the script

if [ -f "./scripts/protect-cluster-pods.sh" ]; then
    source ./scripts/protect-cluster-pods.sh
    print_success "Pod and cluster protection enabled"
else
    print_error "Protection script not found"
    exit 1
fi


# Define print functions
print_step() {
    echo -e "\n${BLUE}=== 🔄 $1 ===${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Add after cleanup function
check_port() {
    print_step "Checking Port ${NEXTJS_PORT}"
    if lsof -i :${NEXTJS_PORT} > /dev/null; then
        # Check if it's our container using the port
        if docker ps | grep -q "${CONTAINER_NAME}.*:${NEXTJS_PORT}"; then
            print_warning "Next.js app is already running in our container"
            print_success "Using existing container"
            exit 0
        else
            print_warning "Port ${NEXTJS_PORT} is in use by another process:"
            lsof -i :${NEXTJS_PORT}
            read -p "Would you like to kill the other process to free port ${NEXTJS_PORT}? (y/N) " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                lsof -ti:${NEXTJS_PORT} | xargs kill -9
                sleep 2
                print_success "Port ${NEXTJS_PORT} freed"
            else
                print_error "Port ${NEXTJS_PORT} is still in use. Cannot start development server"
                exit 1
            fi
        fi
    fi
}

# Add before docker run command
# Add this function after the check_port function
check_docker_daemon() {
    print_step "Checking Docker Daemon"
    if ! docker info >/dev/null 2>&1; then
        print_error "Docker daemon is not running"
        print_warning "Starting Docker Desktop..."
        
        if [ "$PLATFORM" = "macOS" ]; then
            open -a Docker
            # Wait for Docker to start
            print_warning "Waiting for Docker to start..."
            until docker info >/dev/null 2>&1; do
                sleep 1
            done
            print_success "Docker is now running"
        else
            print_error "Please start Docker manually"
            exit 1
        fi
    else
        print_success "Docker daemon is running"
    fi
}

# Add the check before docker run
# Fix the typo in the docker daemon check
# Add this function after cleanup()
handle_existing_container() {
    print_step "Checking Existing Container"
    if docker ps -a | grep -q $CONTAINER_NAME; then
        print_warning "Found existing container, cleaning up..."
        docker stop $CONTAINER_NAME 2>/dev/null
        docker rm $CONTAINER_NAME 2>/dev/null
        print_success "Cleaned up existing container"
    fi
}





# Add after the print functions
protect_cluster() {
    local command=$1
    case "$command" in
        "stop"|"delete")
            print_warning "⚠️  WARNING: Cluster Stop Operation"
            echo "- This cluster contains important monitoring data and metrics"
            echo "- Stopping will shutdown the local Kubernetes cluster"
            echo "- The virtual machine will be stopped"
            echo "- Data will be preserved and can be restored with 'minikube start'"
            while true; do
                read -r -p "Do you want to $command the cluster? (y/N) " yn
                case $yn in
                    [Yy]* )
                        print_warning "⚠️  Final Warning:"
                        echo "- Cluster services will become unavailable"
                        echo "- Monitoring data will be inaccessible until restart"
                        read -r -p "Are you absolutely sure? (y/N) " yn2
                        case $yn2 in
                            [Yy]* ) break;;
                            * ) 
                                print_error "Operation cancelled"
                                return 1;;
                        esac
                        ;;
                    * ) 
                        print_error "Operation cancelled"
                        return 1;;
                esac
            done
            ;;
    esac
    return 0
}

# Add this function to wrap minikube commands
minikube_wrapper() {
    if protect_cluster "$1"; then
        minikube "$@"
    fi
}

# Add after protect_cluster() function
protect_pods() {
    if [[ $1 == "delete" && $2 == "pod" ]]; then
        print_warning "⚠️  WARNING: Pod Deletion Operation"
        echo "- You are attempting to delete pod: $3"
        echo "- This may affect monitoring data collection"
        echo "- Service interruption may occur"
        read -p "Do you want to delete this pod? (y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_warning "⚠️  Final Warning:"
            echo "- Pod deletion may impact system metrics"
            echo "- Dependent services may be affected"
            read -p "Are you absolutely sure? (y/N) " -n 1 -r
            echo
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                print_error "Operation cancelled"
                return 1
            fi
        else
            print_error "Operation cancelled"
            return 1
        fi
    fi
    return 0
}

# Add this wrapper function
kubectl_wrapper() {
    if protect_pods "$@"; then
        kubectl "$@"
    fi
}


# ASCII Art Welcome Banner
echo -e "${CYAN}"
cat << "EOF"
 ___  ____  _   _ _  __      _          
/   \|  _ \| |_(_) |/ /_   _| |__   ___ 
|  0 | |_) |  _| | ' /| | | | '_ \ / _ \
| O  |  __/| | | | . \| |_| | |_) |  __/
\___/|_|   |_| |_|_|\_\\__,_|_.__/ \___|

     ⎈ Kubernetes Development Tool ⎈
=====================================
EOF
echo -e "${NC}"


# Detect OS
print_step "Detecting Operating System"
OS=$(uname -s)
case "${OS}" in
    Darwin*) 
        PLATFORM="macOS"
        print_success "Detected macOS system"
        ;;
    Linux*)  
        PLATFORM="Linux"
        print_success "Detected Linux system"
        ;;
    *)
        print_error "Unsupported OS: ${OS}"
        exit 1
        ;;
esac

# Installation functions
install_macos() {
    print_step "Setting up macOS Environment"
    if ! command -v brew &>/dev/null; then
        print_warning "Homebrew not found. Installing..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        eval "$(/opt/homebrew/bin/brew shellenv 2>/dev/null || /usr/local/bin/brew shellenv)"
        print_success "Homebrew installed successfully"
    else
        print_success "Homebrew already installed"
    fi
    
    print_step "Installing Required Tools"
    echo "📦 Installing container runtime and required tools..."
    # Install required tools
    brew install minikube kubectl helm
    print_success "Tools installed successfully"
    
    # Set minikube to use docker driver
    print_step "Configuring Minikube Driver"
    minikube config set driver docker
    print_success "Minikube configured to use docker"
}

# Development environment setup
setup_dev() {
    print_step "Setting up Development Environment"
    
    # Check if container exists
    if docker ps -a | grep -q $CONTAINER_NAME; then
        print_success "Development container exists"
        
        # Only check for rebuild if container exists
        current_hash=$(md5sum package.json | awk '{ print $1 }')
        needs_rebuild=0
        
        if [ ! -f "$PACKAGE_HASH_FILE" ] || [ "$(cat $PACKAGE_HASH_FILE)" != "$current_hash" ]; then
            needs_rebuild=1
        fi

        if [ $needs_rebuild -eq 1 ]; then
            print_warning "Dependencies changed, rebuilding container..."
            docker stop $CONTAINER_NAME 2>/dev/null
            docker rm $CONTAINER_NAME 2>/dev/null
            echo "🏗️  Building development container..."
            docker build -f Dockerfile.dev -t $CONTAINER_NAME . \
                --build-arg NODE_ENV=development \
                --cache-from $CONTAINER_NAME \
                --build-arg BUILDKIT_INLINE_CACHE=1
            echo $current_hash > $PACKAGE_HASH_FILE
            print_success "Container rebuilt successfully"
        else
            # Start existing container if it's not running
            if ! docker ps | grep -q $CONTAINER_NAME; then
                print_warning "Container exists but not running. Starting..."
                docker start $CONTAINER_NAME
            fi
            print_success "Container is up to date"
        fi
    else
        print_warning "Container not found, building..."
        echo "🏗️  Building development container..."
        docker build -f Dockerfile.dev -t $CONTAINER_NAME .
        echo $(md5sum package.json | awk '{ print $1 }') > $PACKAGE_HASH_FILE
        print_success "Container built successfully"
    fi
}

# Cleanup function
cleanup() {
    print_step "Cleaning Up"
    echo "🧹 Stopping container..."
    docker stop $CONTAINER_NAME 2>/dev/null
    print_success "Cleanup complete"
    exit 0
}

# Check dependencies
check_dependencies() {
    print_step "Checking Dependencies"
    
    local missing_deps=0
    
    # Check system dependencies
    if ! command -v docker &> /dev/null; then
        print_warning "Docker not found"
        missing_deps=1
    else
        print_success "Docker installed"
    fi
    
    if ! command -v minikube &> /dev/null; then
        print_warning "Minikube not found"
        missing_deps=1
    else
        print_success "Minikube installed"
    fi

    # Add Node.js package dependency check
    print_step "Checking Node.js Dependencies"
    if [ -f "package.json" ]; then
        # Install all dependencies if node_modules doesn't exist
        if [ ! -d "node_modules" ]; then
            print_warning "Node modules not found, installing dependencies..."
            npm install
            print_success "Dependencies installed successfully"
        else
            # Check if package.json has changed since last install
            if [ package.json -nt node_modules ]; then
                print_warning "Package.json has been modified, updating dependencies..."
                npm install
                print_success "Dependencies updated successfully"
            else
                print_success "All Node.js dependencies are up to date"
            fi
        fi
    else
        print_error "package.json not found"
        exit 1
    fi

    if [ $missing_deps -eq 1 ]; then
        print_step "Installing Missing Dependencies"
        case "${PLATFORM}" in
            macOS)  install_macos ;;
            Linux)  install_linux ;;
        esac
    fi
}

# Main execution
check_dependencies

# Check Minikube status
print_step "Checking Minikube Status"
if ! minikube status | grep -q "Running"; then
    print_warning "Minikube not running"
    echo "🚀 Starting Minikube cluster..."
    minikube_wrapper start
    print_success "Minikube started successfully"
else
    print_success "Minikube is running"
fi

# Setup Prometheus
# added wrapper, replaced kubectl with kubectl_wrapper.
# Modify the Prometheus setup section to only install, not start
print_step "Checking Prometheus Setup"
if ! helm list | grep -q "my-kube-prometheus-stack"; then
    print_warning "Prometheus not found"
    echo "📊 Setting up Prometheus monitoring..."
    helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
    helm install my-kube-prometheus-stack prometheus-community/kube-prometheus-stack --version 68.4.5
    print_success "Prometheus and Grafana installed successfully"
    echo "To start monitoring services:"
    echo "  Grafana:    ./0ptikube.sh grafana"
    echo "  Prometheus: ./0ptikube.sh prometheus"
else
    print_success "Prometheus already configured"
fi



# Add usage function
show_usage() {
    echo "Usage: ./0ptikube.sh [service]"
    echo "Services:"
    echo "  app        - Start Next.js application (port ${NEXTJS_PORT})"
    echo "  grafana    - Start Grafana dashboard (port ${GRAFANA_PORT})"
    echo "  prometheus - Start Prometheus metrics (port ${PROMETHEUS_PORT})"
    echo "  all        - Start all services (default)"
}

# Add near the bottom of the script, before the docker run commands
# Parse command line arguments
SERVICE=${1:-"all"}


case "$SERVICE" in
    "app")
        print_step "Starting Next.js Application"
        check_port
        check_docker_daemon
        handle_existing_container
        docker run --name $CONTAINER_NAME \
            -p ${NEXTJS_PORT}:3000 \
            -v "$(pwd)":/app \
            -v /app/node_modules \
            --env-file .env \
            $CONTAINER_NAME
        ;;
    "grafana")
        print_step "Starting Grafana Dashboard"
        echo "📊 Access Grafana at http://localhost:${GRAFANA_PORT}"
        kubectl port-forward svc/my-kube-prometheus-stack-grafana ${GRAFANA_PORT}:80
        ;;
    "prometheus")
        print_step "Starting Prometheus"
        echo "📊 Access Prometheus at http://localhost:${PROMETHEUS_PORT}"
        kubectl port-forward svc/my-kube-prometheus-stack-prometheus ${PROMETHEUS_PORT}:9090
        ;;
    "all")
        # Original behavior - start everything
        check_port
        check_docker_daemon
        handle_existing_container
        # Start monitoring in background
        kubectl port-forward svc/my-kube-prometheus-stack-grafana ${GRAFANA_PORT}:80 >/dev/null 2>&1 &
        kubectl port-forward svc/my-kube-prometheus-stack-prometheus ${PROMETHEUS_PORT}:9090 >/dev/null 2>&1 &
        # Start Next.js app
        docker run --name $CONTAINER_NAME \
            -p ${NEXTJS_PORT}:3000 \
            -v "$(pwd)":/app \
            -v /app/node_modules \
            --env-file .env \
            $CONTAINER_NAME
        ;;
    *)
        show_usage
        exit 1
        ;;
esac

