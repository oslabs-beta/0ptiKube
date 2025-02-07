#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

CONTAINER_NAME="0ptikube-dev"
PACKAGE_HASH_FILE=".package-hash"

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
    echo "📦 Installing container runtime and required tools - hyperkit container runtime, minikube, kubectl, helm, prometheus, etc...."
    # Install Docker Machine and container runtime
    brew install docker-machine hyperkit
    # Install other required tools
    brew install minikube kubectl helm
    print_success "Tools installed successfully"
    
    # Set minikube to use hyperkit driver
    print_step "Configuring Minikube Driver"
    minikube config set driver hyperkit
    print_success "Minikube configured to use hyperkit"
}

# Development environment setup
setup_dev() {
    print_step "Setting up Development Environment"
    
    # Check if rebuild is needed
    current_hash=$(md5sum package.json | awk '{ print $1 }')
    needs_rebuild=0
    
    if [ ! -f "$PACKAGE_HASH_FILE" ] || [ "$(cat $PACKAGE_HASH_FILE)" != "$current_hash" ]; then
        needs_rebuild=1
    fi

    if [ $needs_rebuild -eq 1 ]; then
        print_warning "Dependencies changed, rebuilding container..."
        echo "🏗️  Building development container..."
        docker build -f Dockerfile.dev -t $CONTAINER_NAME .
        echo $current_hash > $PACKAGE_HASH_FILE
        print_success "Container rebuilt successfully"
    else
        print_success "Container is up to date"
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
# hmm ddo we still need wrapper for checking pod health...
print_step "Checking Prometheus Setup"
if ! helm list | grep -q "my-kube-prometheus-stack"; then
    print_warning "Prometheus not found"
    echo "📊 Setting up Prometheus monitoring..."
    helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
    helm install my-kube-prometheus-stack prometheus-community/kube-prometheus-stack --version 68.4.5
    # Wait for pods to be ready
    echo "Waiting for Prometheus pods to start..."
    kubectl_wrapper wait --for=condition=ready pod -l app=prometheus -n default --timeout=120s
    print_success "Prometheus installed successfully"
else
    print_success "Prometheus already configured"
fi

# Add this to check pod health
# added wrapper, replaced kubectl with kubectl_wrapper.
check_pod_health() {
    print_step "Checking Pod Health"
    kubectl_wrapper get pods -A
    if [ $? -ne 0 ]; then
        print_warning "Some pods might not be healthy"
    else
        print_success "All pods are healthy"
    fi
}


setup_dev

# Trap cleanup
trap cleanup SIGINT SIGTERM

print_step "Starting Development Environment"
echo "🚀 Launching 0ptiKube development container..."
echo -e "${CYAN}Access your app at http://localhost:3000${NC}"
docker run --name $CONTAINER_NAME -p 3000:3000 -v "$(pwd)":/app -v /app/node_modules $CONTAINER_NAME