# About 0ptikube 🔳
0ptikube is a web-based visualization tool that helps users monitor the current CPU and memory usage of their Kubernetes pods and clusters. It offers near real-time historical monitoring and visual metrics views for the last hour, 12 hours, 24 hours, and 7 days.

# Why 0ptikube? 🤔
Accessing Kubernetes cluster and pod resources through terminal commands can be tedious and cumbersome. 0ptikube streamlines this process by consolidating it into a single, user-friendly interface. With our responsive React and D3.jsbased dashboard, you can easily visualize performance metrics without the hassle of navigating through menus or changing context. ✨

# 0ptikube Features 
- Monitoring: near realtime metrics to monitor a pod or cluster's cpu and memory.
- AI integration: implement AI and rag to get tailored insights into reallocating resoueces for a pod or cluster.

# Prerequsites apps to use 0ptikube app 📦
The following installs are required to use 0ptikube. Great news, all of the following, except node, are included in the install sctipt. We've listed the download links as resources.
1. Node.js - install the latest version [here](https://nodejs.org/en/download)
2. Docker Desktop (included) - [link](https://docs.docker.com/desktop/)
3. Minikube application (included) - [link](https://minikube.sigs.k8s.io/docs/start/?arch=%2Fmacos%2Farm64%2Fstable%2Fbinary+download)
4. Kubectl (included) - [link](https://kubernetes.io/docs/tasks/tools/)
5. Prometheus (included) - [link](https://prometheus.io/docs/prometheus/latest/installation/)

# Project Setup ⚙️
1. Fork the our main branch of the repository on Github.com and then clone it in the terminal. 
   ```bash
   git clone ...
   cd 0ptikube
   ```
2. Install dependendencies for the 0ptikube app
   ```bash
   #  execute the following command in the root folder of the 0ptikube directory.
   npm install
   ```

3. Run the `minikube-install.sh` file script in the root directory of the 0ptikube folder.
   This script installs the following programs utilized in our 0ptikube app: Minikube, Docker Desktop, Kubectl, Helm, and Prometheus.
   ```bash
   # this commands makes the `minikube-install.sh` file an executable:
   chmod u+x minikube-install.sh  
   # execute the script with the following command: 
   minikube-install.sh
   ```
4. After the installation sctipt is complete. Run the following commands in your terminal to get Minikube environment started. 

   a. This following commands enable features used in the minikube cluster.
   ```bash
   # Start Minikube with sufficient resources
   minikube start 
   # Verify Minikube is running and view configuration
   minikube status
   minikube config view #cpu should be 3, and memory 3000 by default.
   # Enable required addons
   minikube addons enable metrics-server  # Aggregates resource usage data for monitoring and autoscaling.
   minikube addons enable dashboard        # Provides a default storage class for dynamic volume provisioning.
   minikube addons enable ingress          # Manages external access to services via HTTP/HTTPS routing.
   minikube addons enable storage-provisioner # Enables dynamic provisioning of storage for persistent volumes.
   ```
   b. Next, copy and paste this code block into the same terminal and execute commands. This applies the RBAC, test pod configurations, services and cron jobs.
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
   ```
   
5. You are now ready to use our 0ptikube application with all the configurations added 🥳
- access your app by running the following commands in a new terminal. We recommend renaming each terminal tab to stay organized:
   ```bash
   # new terminal - run the next.js web server. Keep this tab by itself uninterrupted after running the command.
   # (recommend renaming terminal session 'web server 3000')
   npm start

   # new terminal - execute  prometheus port forwarding 
   # (recommend renaming prom port forward 9090).
   kubectl port-forward svc/my-kube-prometheus-stack-prometheus 9090:9090

   # new terminal - Verify all resources are created:
   kubectl get deployments,pods,cronjobs,servicemonitors
   
   # new terminal - shows each test pod's cpu and memory changes along with the cronjob associated with pod, titled stressor.
   watch "kubectl top pods | grep -E 'test-pod1|test-pod2|test-pod3'"

   ```

6. Create `.env` file in the root directory of 0ptikube folder. 
You'll need to input environment variables nside of the .env file to acces features inside our web app.
Copy and paste the following fields from the code block.
   ```bash
   #Database connection provided
   DATABASE_URL=postgresql://postgres.ikdbpxklslitodszecux:tANLl7BQHp9rMFN0@aws-0-us-west-1.pooler.supabase.com:6543/postgres
   #Prometheus url provided
   PROMETHEUS_BASE_URL=http://localhost:9090 

   # Github Oauth setup
   GITHUB_ID='your information'
   GITHUB_SECRET='your information'
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET='your information'

   # openai api setup
   OPENAI_API_KEY='your open ai key here'
   FINE_TUNED_MODEL='your fine tune model key here'
   ```
Your information from should be entered after the '=' sign.
Here are links on how to attain the following:
- Githun Oauth [link](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app)
- Open AI API [link](https://help.openai.com/en/articles/4936850-where-do-i-find-my-openai-api-key)
- Supabase datbase connection [link](https://supabase.com/docs/guides/database/connecting-to-postgres)

7. Useful commands for Minikube. 

### Minikube Commands
below are general purpose commands
```bash
# Start cluster - started with use of our `minikube.install.sh script`
minikube start
# Check status of control plane (kubernetes cluster)
minikube status
# Stop cluster - safe to do. Similar to pausing an action.
minikube stop
# Delete cluster (after trying our app)
# this command is only recommended  if you intend to make your own cluster or environment from scratch in the future)
minikube delete
```

8. Useful commands for docker.
```bash
# List running containers
docker ps
# List all containers (including stopped)
docker ps -a
# List all images
docker images
```


