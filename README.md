<img src="public/logo-no-background.svg" alt="0PTIKUBE logo" />
<h1 style="font-family: 'Orbitron', sans-serif;">0PTIKUBE</h1>
<h6 style="font-family: 'Orbitron', sans-serif;">Give Your Pods the Optimization They Deserve.</h4>
<hr>

<p>
<strong>An intuituive, simple web application to monitor metrics in your Kubernetes clusters.</strong>
</p

</div>

---

### 👩‍💻 Our Tech Stack 🧑‍💻

#### Frontend 🖼️

![Next.js](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![D3.js](https://img.shields.io/badge/d3%20js-F9A03C?style=for-the-badge&logo=d3.js&logoColor=white)
![HTML](https://img.shields.io/badge/HTML-e85a2e?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS-2e35e8?style=for-the-badge&logo=css3&logoColor=white)

#### Backend 💻

![Next.js](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-671DDF?style=for-the-badge&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)

#### DevOps & Infrastructure ⚙︎

![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Minikube](https://img.shields.io/badge/Minikube-F7931E?style=for-the-badge&logo=kubernetes&logoColor=white)
![Prometheus](https://img.shields.io/badge/Prometheus-E6522C?style=for-the-badge&logo=prometheus&logoColor=white)
![PromQL](https://img.shields.io/badge/PromQL-F57600?style=for-the-badge&logo=prometheus&logoColor=white)

#### Auth & Security 🔐

![GitHub OAuth](https://img.shields.io/badge/GitHub_OAuth-181717?style=for-the-badge&logo=github&logoColor=white)

#### AI 🤖

![OpenAI API](https://img.shields.io/badge/OpenAI_API-412991?style=for-the-badge&logo=openai&logoColor=white)

# 📚 Table of Contents 📚

- [About 0PTIKUBE 🔳](#about-0PTIKUBE-)
- [Why 0PTIKUBE? 🤔](#why-0PTIKUBE-)
- [0PTIKUBE Features 📱](#0PTIKUBE-features-)
- [Prerequisite Apps to Use 0PTIKUBE App 📦](#prerequisite-apps-to-use-0PTIKUBE-app-)
- [Project Setup ⚙️](#project-setup)
- [Future Features 🛠](#future-features-)
- [Contribution Guidelines 📝](#contribution-guidelines-)
- [Contributors 🙏](#contributors-)
- [License 📄](#license-)

# About 0PTIKUBE 🔳

0PTIKUBE is a web-based visualization tool that helps users monitor the current CPU and memory usage of their Kubernetes pods and clusters. It offers near real-time historical monitoring and visual metrics views for the last hour, 12 hours, 24 hours, and 7 days.

# Why 0PTIKUBE? 🤔

Accessing Kubernetes cluster and pod resources through terminal commands can be tedious and cumbersome. 0PTIKUBE streamlines this process by consolidating it into a single, user-friendly interface. With our responsive React and D3.jsbased dashboard, you can easily visualize performance metrics without the hassle of navigating through menus or changing context. ✨

# 0PTIKUBE Features 📱

- Monitoring: near realtime metrics to monitor a pod or cluster's cpu and memory.
- AI integration: implement AI and rag to get tailored insights into reallocating resoueces for a pod or cluster.

# Prerequisite Apps to Use 0PTIKUBE App 📦

The following installs are required to use 0PTIKUBE. Great news, all of the following, except node, are included in the install sctipt. We've listed the download links as resources.

1. Node.js - install the latest version [here](https://nodejs.org/en/download)
2. Docker Desktop (included) - [link](https://docs.docker.com/desktop/)
3. Minikube application (included) - [link](https://minikube.sigs.k8s.io/docs/start/?arch=%2Fmacos%2Farm64%2Fstable%2Fbinary+download)
4. Kubectl (included) - [link](https://kubernetes.io/docs/tasks/tools/)
5. Prometheus (included) - [link](https://prometheus.io/docs/prometheus/latest/installation/)

# Project Setup ⚙️

1. Clone our main branch of the 0PTIKUBE repository on Github.com and then clone it in the terminal.
   ```bash
   git clone https://github.com/oslabs-beta/0ptiKube.git
      cd 0ptikube
   ```
2. Install dependendencies for the 0PTIKUBE app

   ```bash
   #  execute the following command in the root folder of the 0PTIKUBE directory.
      npm install
   ```

3. Run the `minikube-install.sh` file script in the root directory of the 0PTIKUBE folder.
   This script installs the following programs utilized in our 0PTIKUBE app: Minikube, Docker Desktop, Kubectl, Helm, and Prometheus.
   ```bash
   # this commands makes the `minikube-install.sh` file an executable:
      chmod u+x minikube-install.sh
   # execute the script with the following command:
      ./minikube-install.sh
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
   # Apply RBAC configuration
      kubectl apply -f k8s-configs/k8s-testpods/stressor-rbac.yaml

   # Apply Test Pod 1 configurations
      kubectl apply -f k8s-configs/k8s-testpods/test-pod1.yaml
      kubectl apply -f k8s-configs/k8s-testpods/test-pod1-service-monitor.yaml
      kubectl apply -f k8s-configs/k8s-testpods/test-pod1-cronjob.yaml

   # Apply Test Pod 2 configurations
      kubectl apply -f k8s-configs/k8s-testpods/test-pod2.yaml
      kubectl apply -f k8s-configs/k8s-testpods/test-pod2-service-monitor.yaml
      kubectl apply -f k8s-configs/k8s-testpods/test-pod2-cronjob.yaml

   # Apply Test Pod 3 configurations
      kubectl apply -f k8s-configs/k8s-testpods/test-pod3.yaml
      kubectl apply -f k8s-configs/k8s-testpods/test-pod3-service-monitor.yaml
      kubectl apply -f k8s-configs/k8s-testpods/test-pod3-cronjob.yaml
   ```

   c. Next, we are going to containerize our small next.js demo app, that's inside the `load-demo-app`folder. It's associated docker file is
   `Dockerfile.load-demo-app`.
   This will allow us to place the demo app into our kubernetes cluster as a pod. This will allow us to monitor it. Similar to our testpods we
   created in the previous step.

   ```bash
   # Navigate to the load-demo-app directory
      cd load-demo-app

   # Switch to Minikube's Docker daemon
      eval $(minikube docker-env)

   # Build the image (it will now be available in Minikube)
      docker build -t load-demo-app:latest -f Dockerfile.load-demo-app .

   # Apply Demo App configurations
      kubectl apply -f k8s-configs/k8s-demo-app-pod/demoApp-pod.yaml
      kubectl apply -f k8s-configs/k8s-demo-app-pod/demoApp-service.yaml
      kubectl apply -f k8s-configs/k8s-demo-app-pod/demoApp-service-monitor.yaml

   # 5. Verify the deployment
      kubectl get pods    # Check if pod is running
      kubectl get svc     # Check if service is created
      kubectl get servicemonitors    # Check if service monitor is created

   ```

5. You are now ready to use our 0PTIKUBE application with all the configurations added 🥳

- Access your app by running the following commands in a new terminal. We recommend renaming each terminal tab to stay organized:

  ```bash
   # --------------Required terminals for 0ptikube web app-------------------------
   # Terminal 1 - Run the 0PTIKUBE web application
   # (recommend renaming terminal session '0PTIKUBE web server 3000')
      npm start

   # Terminal 2 - Prometheus port forwarding (required for metrics ti display in the webapp)
   # (recommend renaming 'prom port forward 9090')
      kubectl port-forward svc/my-kube-prometheus-stack-prometheus 9090:9090

   #--------------Optional terminals 3-5 -------------------------
   # Terminal 3 - Just for your reference. Monitor the test pods including load-demo-app in terminal. This can be seen easily in our web app.
   # (recommend renaming terminal 'pod monitor')
      watch "kubectl top pods | grep -E 'test-pod1|test-pod2|test-pod3|load-demo-app'"

   # Terminal 4 - View pod and service status for our minikube cluster
   # (recommend renaming 'k8s status')
      kubectl get pods,svc,servicemonitors

   # Terminal 5 - Port forward to access the demo app UI (optional)
   # (recommend renaming terminal session 'demo app forward 3002')
      kubectl port-forward service/demoApp-service 3002:3000
   #this will allow you to view our demo app's UI through the browser http://localhost:3002


  ```

6a. Create `.env` file in the root directory of 0PTIKUBE folder.
You'll need to input environment variables nside of the .env file to access features inside our web app.
Copy and paste the following fields from the code block.

```bash
# Database connection provided
DATABASE_URL=postgresql:"your supabase uri"
# Prometheus URL provided
PROMETHEUS_BASE_URL="http://localhost:9090"

# Github Oauth setup
GITHUB_ID="your GitHub client ID"
GITHUB_SECRET="your GitHub secret"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your Next Auth secret"

# Openai API setup
OPENAI_API_KEY="your OpenAI key here"
FINE_TUNED_MODEL="your fine tune model key here"

## 🔒 SSL Certificate for Database Connection
# To connect to your DB, download the required CA certificate from Supabase.
# Create a folder in root directory with command `mkdir -p certs/`
# Add the downloaded SSL certificate text to a file in the newly created directory called `supabase-ca.pem`. You can add this file to your .gitignore.
# Append "?sslmode=verify-full&sslrootcert=certs/supabase-ca.pem" to the end of your DATABASE_URL in your .env file.
```

Your information from should be entered after the '=' sign.
Here are links on how to attain the following:

- Githun Oauth [link](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app)
- Open AI API [link](https://help.openai.com/en/articles/4936850-where-do-i-find-my-openai-api-key)
- Supabase datbase connection [link](https://supabase.com/docs/guides/database/connecting-to-postgres)

7. Useful commands for Minikube.

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

# Future Features 🛠

- Real-Time Data Streaming: Explore adding real-time cluster/pod health data visualizations via Kubernetes API access to enhance granularity.
- Real-Time Monitoring Alerts: Enable alerts that notify users when their clusters/pods have surpassed or dropped below certain thresholds, allowing more dynamic response times to under- or over-provisioned deployments.
- AI Improvements: Continue to fine-tune and train the AI model for even more accurate optimization insights based on historical container data and saved AI queries and responses to allow the AI to observe the effects of its recommended resource allocation suggestions over time.
- Historical Analysis: Add trend visualization and comparison of AI recommendations against actual resource usage over time.
- User Customization: Allow users to further customize refresh intervals and to set individual container health indicator thresholds.
- Multi-Cluster Support: Expand the platform to support monitoring multiple Kubernetes clusters simultaneously.
- Support for Visualization of Additional Metrics: Create visualizations that measure additional indicators of cluster/pod health including percentage uptime, latency, etc.

## Contribution Guidelines 📝

We welcome contributions from the community! 😇 Want to get involved? 🧑‍💻

1. Fork the Repo
   Click the "Fork" button at the top-right corner of this repository page.
2. Create a Feature Branch

   ```bash
   #run this command in the feature
   git checkout -b feature/nameOfTheFeature

   ```

3. Implement Your Feature
   Add your code, tests, or documentation.
4. Commit Your Changes
   ```bash
   git commit -m "added x feature to file x"
   ```
5. Push to Your Branch
   ```bash
   git push origin feature/nameOfTheFeature
   ```
6. Create a Pull Request (PR)
   Open a PR to the dev branch of our 0PTIKUBE repo. Our team will review and, once approved, merge it in!

## Contributors 🙏

- Jason Stuhmer: [GitHub](https://github.com/NotAStuhmer) | [LinkedIn](https://www.linkedin.com/in/jason-stuhmer/)
- Oliver Fajardo: [GitHub](https://github.com/oliverafajardo) | [LinkedIn](https://www.linkedin.com/in/oliverafajardoucb/)
- Richard Rivera: [GitHub](https://github.com/RichardRiveraRoman) | [LinkedIn]()
- Senay Yakut: [GitHub](https://www.linkedin.com/in/senaykt/) | [LinkedIn](https://github.com/SenayYakut)

We would like to thank you for visiting our page, and any future contributors!

## License 📄

Distributed under the MIT License. Please see `LICENSE` for more information.

Please drop us a ⭐ on GitHub if you enjoy our open source product! Share and help our community grow! 🙌

## 🤝 Connect with Us 🤝
