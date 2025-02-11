#!/usr/bin/env bash

set -e # Exit immediately on error

# Detect operating system
OS=$(uname -s)
case "${OS}" in
Darwin*) PLATFORM="macOS" ;;
Linux*) PLATFORM="Linux" ;;
*)
  echo "Unsupported OS: ${OS}"
  exit 1
  ;;
esac

# Common installation function for macOS
install_macos() {
  # Check for Homebrew installation
  if ! command -v brew &>/dev/null; then
    echo "Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

    # Add Homebrew to PATH for current session
    if [[ -x /opt/homebrew/bin/brew ]]; then
      eval "$(/opt/homebrew/bin/brew shellenv)"
    elif [[ -x /usr/local/bin/brew ]]; then
      eval "$(/usr/local/bin/brew shellenv)"
    fi
  fi

  # Install required tools
  brew install minikube kubectl helm

  # Start Minikube with default driver
  minikube start

  # Add Prometheus repository
  helm repo add prometheus-community https://prometheus-community.github.io/helm-charts

  # Install Prometheus
  helm install my-kube-prometheus-stack prometheus-community/kube-prometheus-stack --version 68.4.5

  # Completion message for macOS
  echo -e "\nInstallation complete"
  echo "You can now use minikube, kubectl, and helm."
  echo "Run 'minikube status' to check the status of your cluster."
}

# Linux installation function
install_linux() {
  # Verify sudo privileges
  if [[ $EUID -ne 0 ]]; then
    echo "This script must be run with sudo privileges"
    exit 1
  fi

  # Docker installation section
  echo "Starting Docker installation..."

  # Update and install base dependencies (including apt-transport-https)
  apt-get update
  apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg

  # Add Docker's official GPG key
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
  chmod a+r /etc/apt/keyrings/docker.asc

  # Add Docker repository
  echo "Adding Docker repository..."
  echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] \
  https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" |
    tee /etc/apt/sources.list.d/docker.list >/dev/null

  # Install Docker components
  apt-get update
  apt-get install -y \
    docker-ce \
    docker-ce-cli \
    containerd.io \
    docker-buildx-plugin \
    docker-compose-plugin

  # Kubernetes tools installation
  echo "Installing Kubernetes components..."

  # Add Kubernetes GPG key
  curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.32/deb/Release.key |
    gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
  chmod 644 /etc/apt/keyrings/kubernetes-apt-keyring.gpg

  # Add Kubernetes repository
  echo "deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] \
    https://pkgs.k8s.io/core:/stable:/v1.32/deb/ /" |
    tee /etc/apt/sources.list.d/kubernetes.list >/dev/null
  chmod 644 /etc/apt/sources.list.d/kubernetes.list

  # Add Helm GPG key
  curl https://baltocdn.com/helm/signing.asc | gpg --dearmor | tee /usr/share/keyrings/helm.gpg >/dev/null

  # Add Helm repository
  apt-get install apt-transport-https --yes
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/helm.gpg] \
    https://baltocdn.com/helm/stable/debian/ all main" |
    tee /etc/apt/sources.list.d/helm-stable-debian.list

  # Install kubectl
  apt-get update
  apt-get install -y kubectl

  # Install Helm
  apt-get update
  apt-get install helm

  # Minikube installation section
  echo "Starting Minikube installation..."

  # Install network dependencies
  apt-get install -y conntrack

  # Architecture detection
  ARCH=$(dpkg --print-architecture)
  MINIKUBE_URL="https://storage.googleapis.com/minikube/releases/latest/minikube_latest_${ARCH}.deb"

  # Download and install Minikube
  echo "Downloading Minikube for ${ARCH} architecture..."
  curl -LO "${MINIKUBE_URL}"
  dpkg -i "minikube_latest_${ARCH}.deb"
  apt-get install -f -y

  # Configure Minikube for the original user
  echo "Configuring Minikube..."
  sudo -u "${SUDO_USER}" minikube config set driver docker

  # Add original user to docker group
  echo "Adding ${SUDO_USER} to docker group..."
  usermod -aG docker "${SUDO_USER}"

  # Cleanup
  rm "minikube_latest_${ARCH}.deb"

  # Uncomment when you have logged back in and run the script again or just run these commands individually
  # Add Prometheus repository
  # sudo -u "${SUDO_USER}" helm repo add prometheus-community https://prometheus-community.github.io/helm-charts

  # Install Prometheus
  # sudo -u "${SUDO_USER}" helm install my-kube-prometheus-stack prometheus-community/kube-prometheus-stack --version 68.4.5

  # Completion message
  echo -e "\nInstallation complete!"
  echo "You need to logout and login again for group changes to take effect."
  echo "After relogin, run: minikube start"
  echo "Run 'minikube status' to check the status of your cluster."
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
