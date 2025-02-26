#!/usr/bin/env bash

# Exit immediately if any command fails
set -e

# Function to prompt for user confirmation
confirm() {
  local message=$1
  local default=${2:-"y"} # Default to yes if not specified

  if [ "$default" = "y" ]; then
    prompt="[Y/n]"
  else
    prompt="[y/N]"
  fi

  echo -ne "${YELLOW}$message $prompt ${NC}"
  read -r response
  response=${response:-$default} # Default value if empty

  if [[ "$response" =~ ^[Yy]$ ]]; then
    return 0 # True
  else
    return 1 # False
  fi
}

# ========================================================================
# MINIKUBE INSTALLATION SCRIPT
# ========================================================================
# This script installs and configures Minikube, Kubernetes CLI (kubectl),
# and Helm on macOS or Linux systems. It also sets up Prometheus for
# monitoring your Kubernetes cluster.
# ========================================================================

# cat <<'EOF'
#       ___           ___                                 ___           ___                         ___
#      /  /\         /  /\        ___       ___          /__/|         /__/\         _____         /  /\
#     /  /::\       /  /::\      /  /\     /  /\        |  |:|         \  \:\       /  /::\       /  /:/_
#    /  /:/\:\     /  /:/\:\    /  /:/    /  /:/        |  |:|          \  \:\     /  /:/\:\     /  /:/ /\
#   /  /:/  \:\   /  /:/~/:/   /  /:/    /__/::\      __|  |:|      ___  \  \:\   /  /:/~/::\   /  /:/ /:/_
#  /__/:/ \__\:\ /__/:/ /:/   /  /::\    \__\/\:\__  /__/\_|:|____ /__/\  \__\:\ /__/:/ /:/\:| /__/:/ /:/ /\
#  \  \:\ /  /:/ \  \:\/:/   /__/:/\:\      \  \:\/\ \  \:\/:::::/ \  \:\ /  /:/ \  \:\/:/~/:/ \  \:\/:/ /:/
#   \  \:\  /:/   \  \::/    \__\/  \:\      \__\::/  \  \::/~~~~   \  \:\  /:/   \  \::/ /:/   \  \::/ /:/
#    \  \:\/:/     \  \:\         \  \:\     /__/:/    \  \:\        \  \:\/:/     \  \:\/:/     \  \:\/:/
#     \  \::/       \  \:\         \__\/     \__\/      \  \:\        \  \::/       \  \::/       \  \::/
#      \__\/         \__\/                               \__\/         \__\/         \__\/         \__\/
# EOF

# Define colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Print a stylized header for the script
echo -e "${BLUE}================================================================${NC}"
echo -e "${GREEN}🚀 Welcome to the Minikube Installation Script 🚀${NC}"
echo -e "${BLUE}================================================================${NC}"
echo -e "This script will install and configure the following components:"
echo -e "  • ${YELLOW}Docker${NC} - Container runtime"
echo -e "  • ${YELLOW}Minikube${NC} - Local Kubernetes cluster"
echo -e "  • ${YELLOW}kubectl${NC} - Kubernetes command-line tool"
echo -e "  • ${YELLOW}Helm${NC} - Kubernetes package manager"
echo -e "  • ${YELLOW}Prometheus${NC} - Monitoring and alerting"
echo -e "${BLUE}================================================================${NC}"

# Detect operating system
echo -e "\n${GREEN}🔍 Detecting operating system...${NC}"
OS=$(uname -s)
case "${OS}" in
Darwin*)
  PLATFORM="macOS"
  echo -e "  ✅ Detected ${YELLOW}macOS${NC} system."
  ;;
Linux*)
  PLATFORM="Linux"
  echo -e "  ✅ Detected ${YELLOW}Linux${NC} system."
  ;;
*)
  echo -e "${RED}❌ Unsupported OS: ${OS}${NC}"
  echo -e "This script only supports macOS and Linux."
  exit 1
  ;;
esac

# Function to run commands as the original user with bash
# This ensures compatibility with any shell the user might be using
run_as_user() {
  sudo -u "${SUDO_USER}" bash -c "$1"
}

# ======================
# macOS Installation
# ======================
install_macos() {
  echo -e "\n${BLUE}================================================================${NC}"
  echo -e "${GREEN}🍎 Starting macOS Installation${NC}"
  echo -e "${BLUE}================================================================${NC}"

  # Check for Homebrew installation
  echo -e "\n${GREEN}🔍 Checking for Homebrew...${NC}"
  if ! command -v brew &>/dev/null; then
    echo -e "  ${YELLOW}⚠️ Homebrew not found.${NC}"
    if confirm "Do you want to install Homebrew?"; then
      echo -e "  ${GREEN}🔄 Installing Homebrew...${NC}"
      /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

      # Add Homebrew to PATH for current session
      echo -e "  ${GREEN}⚙️ Configuring Homebrew...${NC}"
      if [[ -x /opt/homebrew/bin/brew ]]; then
        eval "$(/opt/homebrew/bin/brew shellenv)"
        echo -e "  ✅ Homebrew installed and configured for Apple Silicon Mac."
      elif [[ -x /usr/local/bin/brew ]]; then
        eval "$(/usr/local/bin/brew shellenv)"
        echo -e "  ✅ Homebrew installed and configured for Intel Mac."
      fi
    else
      echo -e "  ${RED}❌ Homebrew is required to continue. Exiting.${NC}"
      exit 1
    fi
  else
    echo -e "  ✅ Homebrew is already installed."
  fi

  # Install required tools
  echo -e "\n${GREEN}📦 Installing required packages...${NC}"
  echo -e "  ${YELLOW}⚙️ Installing minikube, kubectl, and helm...${NC}"
  brew install minikube kubectl helm
  echo -e "  ✅ Core Kubernetes tools installed."

  echo -e "  ${YELLOW}⚙️ Setting up Docker...${NC}"
  if ! command -v docker &>/dev/null; then
    # Docker binary not found, proceed with installation
    if confirm "Docker not found. Would you like to install Docker Desktop?"; then
      echo -e "  ${YELLOW}⚙️ Installing Docker Desktop...${NC}"
      brew install --cask docker
      echo -e "  ✅ Docker installed."
    else
      echo -e "  ${YELLOW}⚠️ Docker installation skipped. Minikube might not work correctly.${NC}"
    fi
  else
    # Docker binary found, check if it's Docker Desktop
    echo -e "  ✅ Docker binary found at $(which docker)"

    # Check if Docker Desktop app exists
    if [ -d "/Applications/Docker.app" ]; then
      echo -e "  ✅ Docker Desktop is already installed."
    else
      echo -e "  ${YELLOW}⚠️ Docker binary exists but Docker Desktop app may not be installed.${NC}"
      if confirm "Would you like to attempt to reinstall Docker Desktop?"; then
        echo -e "  ${YELLOW}⚙️ Attempting to install Docker Desktop...${NC}"
        # Try to install but suppress the error about binary already existing
        brew install --cask docker 2>/dev/null || true
        echo -e "  ${YELLOW}⚙️ Docker Desktop installation attempted.${NC}"
      else
        echo -e "  ${YELLOW}⚠️ Docker Desktop installation skipped.${NC}"
      fi
    fi
  fi

  # Start Docker if not running
  echo -e "\n${GREEN}🐳 Starting Docker...${NC}"
  if ! (pgrep -f Docker >/dev/null); then
    echo -e "  ${YELLOW}⚙️ Opening Docker application...${NC}"
    open -a "Docker"
    echo -e "  ${YELLOW}⏳ Waiting for Docker to start (this may take a moment)...${NC}"
    # Simple wait loop until Docker is running
    attempt=0
    max_attempts=30
    while ! (docker info >/dev/null 2>&1) && [ $attempt -lt $max_attempts ]; do
      sleep 2
      attempt=$((attempt + 1))
      echo -ne "  ${YELLOW}⏳ Still waiting for Docker to start ($attempt/$max_attempts)...${NC}\r"
    done

    if (docker info >/dev/null 2>&1); then
      echo -e "\n  ✅ Docker started successfully."
    else
      echo -e "\n  ${RED}❌ Docker failed to start. Please start Docker Desktop manually.${NC}"
      echo -e "  ${YELLOW}⚠️ The script will continue, but Minikube may fail to start without Docker.${NC}"
    fi
  else
    echo -e "  ✅ Docker is already running."
  fi

  # Start Minikube with docker driver
  echo -e "\n${GREEN}🔄 Setting up Minikube...${NC}"

  # Check if a minikube profile already exists
  if minikube profile list 2>/dev/null | grep -q "minikube"; then
    echo -e "  ${YELLOW}⚠️ Minikube profile exists.${NC}"
    if confirm "Do you want to delete the existing Minikube cluster and start fresh? (Recommended)"; then
      echo -e "  ${YELLOW}🗑️ Deleting existing Minikube cluster...${NC}"
      minikube delete
      echo -e "  ✅ Existing Minikube cluster deleted."
    else
      echo -e "  ${YELLOW}⚠️ Keeping existing Minikube cluster.${NC}"
    fi
  fi

  echo -e "\n${GREEN}⚙️ Configuring Minikube...${NC}"
  echo -e "  ${YELLOW}⚙️ Setting Minikube driver to Docker...${NC}"
  minikube config set driver docker
  echo -e "  ${YELLOW}⚙️ Allocating resources (2 CPUs, 2GB RAM)...${NC}"
  minikube config set cpus 2      # Core count
  minikube config set memory 3000 # 3 GB
  echo -e "  ✅ Minikube configured."

  echo -e "  ${YELLOW}🚀 Starting Minikube...${NC}"
  echo -e "  ${YELLOW}⏳ This may take a few minutes...${NC}"
  minikube start
  echo -e "  ✅ Minikube started successfully."

  # Add Prometheus repository
  echo -e "\n${GREEN}📊 Setting up Prometheus for monitoring...${NC}"
  echo -e "  ${YELLOW}⚙️ Adding Prometheus Helm repository...${NC}"
  helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
  echo -e "  ✅ Prometheus repository added."

  # Update Helm repositories
  echo -e "  ${YELLOW}⚙️ Updating Helm repositories...${NC}"
  helm repo update
  echo -e "  ✅ Helm repositories updated."

  # Install Prometheus
  echo -e "  ${YELLOW}⚙️ Installing Prometheus stack...${NC}"
  echo -e "  ${YELLOW}⏳ This may take a few minutes...${NC}"
  helm install my-kube-prometheus-stack prometheus-community/kube-prometheus-stack --version 68.4.5
  echo -e "  ✅ Prometheus installed successfully."

  # Completion message for macOS
  echo -e "\n${BLUE}================================================================${NC}"
  echo -e "${GREEN}🎉 Installation Complete! 🎉${NC}"
  echo -e "${BLUE}================================================================${NC}"
  echo -e "You can now use minikube, kubectl, and helm."
  echo -e "\n${YELLOW}Useful commands:${NC}"
  echo -e "  • ${GREEN}minikube status${NC} - Check the status of your cluster"
  echo -e "  • ${GREEN}kubectl get pods --all-namespaces${NC} - View all running pods"
  echo -e "  • ${GREEN}kubectl get services${NC} - View all services"
  echo -e "  • ${GREEN}helm list${NC} - View installed Helm charts"
  echo -e "${BLUE}================================================================${NC}"
}

# ======================
# Linux Installation
# ======================
install_linux() {
  echo -e "\n${BLUE}================================================================${NC}"
  echo -e "${GREEN}🐧 Starting Linux Installation${NC}"
  echo -e "${BLUE}================================================================${NC}"

  # Verify sudo privileges
  if [[ $EUID -ne 0 ]]; then
    echo -e "${RED}❌ This script must be run with sudo privileges${NC}"
    echo -e "Please run as: sudo $0"
    exit 1
  fi

  # Docker installation section
  echo -e "\n${GREEN}🐳 Starting Docker installation...${NC}"

  # Update and install base dependencies (including apt-transport-https)
  echo -e "  ${YELLOW}⚙️ Updating package lists...${NC}"
  apt-get update
  echo -e "  ${YELLOW}⚙️ Installing required dependencies...${NC}"
  apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg
  echo -e "  ✅ Base dependencies installed."

  # Add Docker's official GPG key
  echo -e "  ${YELLOW}⚙️ Adding Docker GPG key...${NC}"
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
  chmod a+r /etc/apt/keyrings/docker.asc
  echo -e "  ✅ Docker GPG key added."

  # Add Docker repository
  echo -e "  ${YELLOW}⚙️ Adding Docker repository...${NC}"
  echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] \
    https://download.docker.com/linux/ubuntu \
    $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" |
    tee /etc/apt/sources.list.d/docker.list >/dev/null
  echo -e "  ✅ Docker repository added."

  # Install Docker components
  echo -e "  ${YELLOW}⚙️ Installing Docker components...${NC}"
  apt-get update
  apt-get install -y \
    docker-ce \
    docker-ce-cli \
    containerd.io \
    docker-buildx-plugin \
    docker-compose-plugin
  echo -e "  ✅ Docker installed successfully."

  # Kubernetes tools installation
  echo -e "\n${GREEN}☸️ Installing Kubernetes components...${NC}"

  # Add Kubernetes GPG key
  echo -e "  ${YELLOW}⚙️ Adding Kubernetes GPG key...${NC}"
  curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.32/deb/Release.key |
    gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
  chmod 644 /etc/apt/keyrings/kubernetes-apt-keyring.gpg
  echo -e "  ✅ Kubernetes GPG key added."

  # Add Kubernetes repository
  echo -e "  ${YELLOW}⚙️ Adding Kubernetes repository...${NC}"
  echo "deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] \
        https://pkgs.k8s.io/core:/stable:/v1.32/deb/ /" |
    tee /etc/apt/sources.list.d/kubernetes.list >/dev/null
  chmod 644 /etc/apt/sources.list.d/kubernetes.list
  echo -e "  ✅ Kubernetes repository added."

  # Add Helm GPG key
  echo -e "  ${YELLOW}⚙️ Adding Helm GPG key...${NC}"
  curl https://baltocdn.com/helm/signing.asc | gpg --dearmor | tee /usr/share/keyrings/helm.gpg >/dev/null
  echo -e "  ✅ Helm GPG key added."

  # Add Helm repository
  echo -e "  ${YELLOW}⚙️ Adding Helm repository...${NC}"
  apt-get install apt-transport-https --yes
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/helm.gpg] \
        https://baltocdn.com/helm/stable/debian/ all main" |
    tee /etc/apt/sources.list.d/helm-stable-debian.list
  echo -e "  ✅ Helm repository added."

  # Install kubectl
  echo -e "  ${YELLOW}⚙️ Installing kubectl...${NC}"
  apt-get update
  apt-get install -y kubectl
  echo -e "  ✅ kubectl installed."

  # Install Helm
  echo -e "  ${YELLOW}⚙️ Installing Helm...${NC}"
  apt-get update
  apt-get install helm
  echo -e "  ✅ Helm installed."

  # Minikube installation section
  echo -e "\n${GREEN}🔄 Starting Minikube installation...${NC}"

  # Install network dependencies
  echo -e "  ${YELLOW}⚙️ Installing network dependencies...${NC}"
  apt-get install -y conntrack
  echo -e "  ✅ Network dependencies installed."

  # Architecture detection
  echo -e "  ${YELLOW}🔍 Detecting architecture...${NC}"
  ARCH=$(dpkg --print-architecture)
  MINIKUBE_URL="https://storage.googleapis.com/minikube/releases/latest/minikube_latest_${ARCH}.deb"
  echo -e "  ✅ Detected ${ARCH} architecture."

  # Download and install Minikube
  echo -e "  ${YELLOW}⚙️ Downloading Minikube for ${ARCH} architecture...${NC}"
  curl -LO "${MINIKUBE_URL}"
  echo -e "  ${YELLOW}⚙️ Installing Minikube package...${NC}"
  dpkg -i "minikube_latest_${ARCH}.deb"
  apt-get install -f -y
  echo -e "  ✅ Minikube installed."

  # Cleanup
  echo -e "  ${YELLOW}🧹 Cleaning up downloaded files...${NC}"
  rm "minikube_latest_${ARCH}.deb"
  echo -e "  ✅ Cleanup complete."

  # Configure Minikube for the original user
  echo -e "\n${GREEN}⚙️ Configuring Minikube...${NC}"
  echo -e "  ${YELLOW}⚙️ Setting Minikube driver to Docker...${NC}"
  run_as_user "minikube config set driver docker"
  echo -e "  ${YELLOW}⚙️ Allocating resources (2 CPUs, 2GB RAM)...${NC}"
  run_as_user "minikube config set cpus 2"      # Core count
  run_as_user "minikube config set memory 3000" # 3 GB
  echo -e "  ✅ Minikube configured."

  # Add original user to docker group
  echo -e "  ${YELLOW}⚙️ Adding ${SUDO_USER} to docker group...${NC}"
  usermod -aG docker "${SUDO_USER}"
  echo -e "  ✅ User added to docker group."

  # Notify user about group changes
  echo -e "  ${YELLOW}⚠️ Note: You may need to log out and log back in for group changes to take effect.${NC}"

  # Start Minikube as the user
  echo -e "  ${YELLOW}🚀 Starting Minikube...${NC}"

  # Check if a minikube profile already exists
  if run_as_user "minikube profile list 2>/dev/null | grep -q minikube"; then
    echo -e "  ${YELLOW}⚠️ Minikube profile exists.${NC}"
    if confirm "Do you want to delete the existing Minikube cluster and start fresh?"; then
      echo -e "  ${YELLOW}🗑️ Deleting existing Minikube cluster...${NC}"
      run_as_user "minikube delete"
      echo -e "  ✅ Existing Minikube cluster deleted."
    else
      echo -e "  ${YELLOW}⚠️ Keeping existing Minikube cluster.${NC}"
    fi
  fi

  echo -e "  ${YELLOW}⏳ Starting Minikube (this may take a few minutes)...${NC}"
  run_as_user "minikube start"
  echo -e "  ✅ Minikube started successfully."

  # Add Prometheus repository
  echo -e "\n  ${YELLOW}📊 Setting up Prometheus for monitoring...${NC}"
  echo -e "  ${YELLOW}⚙️ Adding Prometheus Helm repository...${NC}"
  run_as_user "helm repo add prometheus-community https://prometheus-community.github.io/helm-charts"
  echo -e "  ✅ Prometheus repository added."

  # Update Helm repositories
  echo -e "  ${YELLOW}⚙️ Updating Helm repositories...${NC}"
  run_as_user "helm repo update"
  echo -e "  ✅ Helm repositories updated."

  # Install Prometheus
  echo -e "  ${YELLOW}⚙️ Installing Prometheus stack...${NC}"
  echo -e "  ${YELLOW}⏳ This may take a few minutes...${NC}"
  run_as_user "helm install my-kube-prometheus-stack prometheus-community/kube-prometheus-stack --version 68.4.5"
  echo -e "  ✅ Prometheus installed successfully."

  # Completion message
  echo -e "\n${BLUE}================================================================${NC}"
  echo -e "${GREEN}🎉 Installation Complete! 🎉${NC}"
  echo -e "${BLUE}================================================================${NC}"
  echo -e "You can now use minikube, kubectl, and helm."
  echo -e "\n${YELLOW}Useful commands:${NC}"
  echo -e "  • ${GREEN}minikube status${NC} - Check the status of your cluster"
  echo -e "  • ${GREEN}kubectl get pods --all-namespaces${NC} - View all running pods"
  echo -e "  • ${GREEN}kubectl get services${NC} - View all services"
  echo -e "  • ${GREEN}helm list${NC} - View installed Helm charts"
  echo -e "\n${YELLOW}⚠️ Important notes:${NC}"
  echo -e "  • You may need to log out and log back in for docker group changes to take effect"
  echo -e "  • If the Minikube start failed, try running 'minikube start' manually"
  echo -e "${BLUE}================================================================${NC}"

  # Ask if user wants to start a new shell with docker group without relogging
  if confirm "Would you like to skip relogging and start a new shell with your user added to docker group instead?"; then
    echo -e "${YELLOW}Starting a new shell with docker group privileges...${NC}"
    echo -e "${GREEN}After this completes, you can run 'minikube start' manually if needed.${NC}"
    echo -e "${YELLOW}Press Ctrl+D or type 'exit' when you're done with this shell.${NC}"
    run_as_user "newgrp docker"
  fi
}

# Main installation flow
case "${PLATFORM}" in
macOS)
  install_macos
  ;;
Linux)
  install_linux
  ;;
esac
