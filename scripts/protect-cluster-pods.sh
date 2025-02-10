#!/bin/bash

# Override the minikube command with our protected version
minikube() {
    case "$1" in
        "stop")
            echo -e "\033[1;33m⚠️  WARNING: Cluster Stop Operation\033[0m"
            echo -e "\033[1;33m- This cluster contains important monitoring data and metrics"
            echo -e "- Stopping will shutdown the local Kubernetes cluster"
            echo -e "- The virtual machine will be stopped"
            echo -e "- Data will be preserved and can be restored with 'minikube start'\033[0m"
            echo -n "Do you want to stop the cluster? (y/N) "
            read answer
            if [[ $answer =~ ^[Yy]$ ]]; then
                echo -e "\033[1;31m⚠️  Final Warning:\033[0m"
                echo -e "- Cluster services will become unavailable"
                echo -e "- Monitoring data will be inaccessible until restart"
                echo -n "Are you absolutely sure? (y/N) "
                read answer2
                if [[ $answer2 =~ ^[Yy]$ ]]; then
                    command minikube stop
                else
                    echo -e "\033[0;31m❌ Operation cancelled\033[0m"
                    return 1
                fi
            else
                echo -e "\033[0;31m❌ Operation cancelled\033[0m"
                return 1
            fi
            ;;
        "delete")
            echo -e "\033[1;31m🚨 CRITICAL WARNING: Cluster Deletion Operation\033[0m"
            echo -e "\033[1;33m- This will permanently delete the local Kubernetes cluster"
            echo -e "- All monitoring data and metrics will be lost"
            echo -e "- The virtual machine will be removed"
            echo -e "- All cluster state and data will be permanently deleted\033[0m"
            while true; do
                read -r -p "Do you want to delete the cluster? (y/N) " yn
                case $yn in
                    [Yy]* )
                        echo -e "\033[1;31m⚠️  Final Warning:\033[0m"
                        echo -e "- This action CANNOT be undone"
                        echo -e "- All cluster data will be permanently lost"
                        echo -e "- You will need to rebuild the cluster from scratch"
                        read -r -p "Are you absolutely sure? (y/N) " yn2
                        case $yn2 in
                            [Yy]* ) break;;
                            * ) 
                                echo -e "\033[0;31m❌ Operation cancelled\033[0m"
                                return 1;;
                        esac
                        ;;
                    * ) 
                        echo -e "\033[0;31m❌ Operation cancelled\033[0m"
                        return 1;;
                esac
            done
            ;;
    esac
    command minikube "$@"
}

# Override kubectl delete command for pod protection
kubectl() {
    if [[ $1 == "delete" && $2 == "pod" ]]; then
        echo -e "\033[1;33m⚠️  WARNING: Pod Deletion Operation\033[0m"
        echo -e "- You are attempting to delete pod: $3"
        echo -e "- This may affect monitoring data collection"
        echo -e "- Service interruption may occur"
        echo -n "Do you want to delete this pod? (y/N) "
        read yn
        if [[ $yn =~ ^[Yy]$ ]]; then
            echo -e "\033[1;31m⚠️  Final Warning:\033[0m"
            echo -e "- Pod deletion may impact system metrics"
            echo -e "- Dependent services may be affected"
            echo -n "Are you absolutely sure? (y/N) "
            read yn2
            if [[ $yn2 =~ ^[Yy]$ ]]; then
                command kubectl "$@"
            else
                echo -e "\033[0;31m❌ Operation cancelled\033[0m"
                return 1
            fi
        else
            echo -e "\033[0;31m❌ Operation cancelled\033[0m"
            return 1
        fi
    else
        command kubectl "$@"
    fi
}