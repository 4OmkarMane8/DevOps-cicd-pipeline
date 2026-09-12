# AWS DevOps CI/CD Pipeline with GitHub Actions, Docker & Kubernetes

![AWS](https://img.shields.io/badge/AWS-Cloud-orange)
![Docker](https://img.shields.io/badge/Docker-Containerization-blue)
![Kubernetes](https://img.shields.io/badge/Kubernetes-Orchestration-326CE5)
![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-CI%2FCD-black)
![Linux](https://img.shields.io/badge/Linux-Server-FCC624)

## 📌 Project Overview

This project demonstrates an automated CI/CD pipeline for deploying a containerized web application using GitHub Actions, Docker, Docker Hub, Kubernetes, Minikube, and AWS EC2.

Whenever application code is pushed to the GitHub repository, GitHub Actions automatically builds a Docker image, pushes the image to Docker Hub, and deploys the updated application to Kubernetes running on an AWS EC2 instance.

The project demonstrates practical implementation of Continuous Integration and Continuous Deployment using modern DevOps tools.

🏗️ Architecture
<img width="1722" height="953" alt="Screenshot 2026-09-12 215008" src="https://github.com/user-attachments/assets/32ab76f6-7ac4-4ff7-8493-488955a1cd50" />

📂 Project Structure


---

## 🛠️ Technologies Used

| Technology | Purpose | Version |
|-----------|---------|---------|
| **GitHub** | Version control & CI/CD platform | Latest |
| **GitHub Actions** | Automation workflow engine | Latest |
| **Docker** | Container runtime & packaging | Latest |
| **Docker Hub** | Container image registry | Public |
| **Kubernetes** | Container orchestration | 1.28+ |
| **Minikube** | Local Kubernetes cluster | Latest |
| **AWS EC2** | Cloud compute instance | Ubuntu 22.04 |
| **Node.js** | Application runtime | 18.x |
| **Express.js** | Web framework | 4.18.2 |

---

## 📋 Prerequisites

Before you begin, ensure you have:

- ✅ AWS Account (Free Tier eligible)
- ✅ GitHub Account
- ✅ Docker Hub Account
- ✅ SSH client (MobaXterm, PuTTY, or terminal)
- ✅ Basic Linux/Terminal knowledge
- ✅ ~2 hours setup time

---

## 🚀 Quick Start

### 1. Create EC2 Instance

```bash
# Instance Configuration
- AMI: Ubuntu 22.04 LTS
- Type: t3.medium
- Storage: 30 GB
- Security Group: Allow SSH (22), HTTP (8080), NodePort (30080)
```

### 2. Connect to EC2

```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

### 3. Install Docker & Kubernetes

```bash
# Update system
sudo apt update -y && sudo apt upgrade -y

# Install Docker
sudo apt install docker.io -y
sudo systemctl enable docker
sudo systemctl start docker

# Add user to docker group
sudo usermod -aG docker ubuntu
newgrp docker

# Install kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
sudo mv kubectl /usr/local/bin/

# Install Minikube
curl -LO https://github.com/kubernetes/minikube/releases/latest/download/minikube-linux-amd64
chmod +x minikube-linux-amd64
sudo mv minikube-linux-amd64 /usr/local/bin/minikube

# Start Kubernetes cluster
minikube start --driver=docker --nodes 2
kubectl get nodes
```

### 4. Clone Repository

```bash
git clone git@github.com:YOUR-USERNAME/DevOps-cicd-pipeline.git
cd DevOps-cicd-pipeline
```

### 5. Add GitHub Secrets

Navigate to: **Repository → Settings → Secrets and Variables → Actions**

Add these 5 secrets:

| Secret Name | Value |
|------------|-------|
| `DOCKER_USERNAME` | Your Docker Hub username |
| `DOCKER_PASSWORD` | Docker Hub access token |
| `EC2_HOST` | Your EC2 public IP |
| `EC2_USER` | `ubuntu` |
| `EC2_SSH_KEY` | Your EC2 private key |

### 6. Deploy Manually (First Time)

```bash
# Apply Kubernetes deployment
kubectl apply -f k8s/deployment.yml

# Apply Kubernetes service
kubectl apply -f k8s/service.yml

# Setup port forwarding
nohup kubectl port-forward service/demo-app-service 8080:3000 --address 0.0.0.0 >/tmp/port-forward.log 2>&1 &

# Access application
# Open browser: http://your-ec2-ip:8080
```

### 7. Test Automated Pipeline

```bash
# Make a code change
nano app.js
# Change: res.send('Welcome To DevOps CI/CD Project v2');

# Commit and push
git add .
git commit -m "Update app message"
git push origin main

# Watch GitHub Actions → Actions tab
# Wait 3-5 minutes for automatic deployment
# Refresh browser - see updated message!
```

---


---

## 📝 File Descriptions

### `app.js`
**Purpose:** Main application file  
**Language:** Node.js (JavaScript)  
**What it does:** Express.js web server that responds to HTTP requests

```javascript
// Listens on port 3000
// Returns "Welcome To DevOps CI/CD Project" message
```

### `package.json`
**Purpose:** Node.js project configuration  
**What it does:** Defines dependencies (Express.js) and startup command

```json
{
  "dependencies": {
    "express": "^4.18.2"
  },
  "scripts": {
    "start": "node app.js"
  }
}
```

### `Dockerfile`
**Purpose:** Blueprint for creating Docker container image  
**What it does:**
1. Start from Node.js 18 base image
2. Set working directory
3. Copy application files
4. Install dependencies with npm
5. Expose port 3000
6. Start application

### `k8s/deployment.yml`
**Purpose:** Kubernetes deployment configuration  
**What it does:**
- Specifies 2 replica pods for high availability
- Pulls Docker image from Docker Hub
- Configures container port (3000)
- Sets image pull policy to Always (get latest)

### `k8s/service.yml`
**Purpose:** Kubernetes service configuration  
**What it does:**
- Exposes application outside cluster using NodePort
- Maps port 3000 to 30080 (external access)
- Selects pods with label "app: demo-app"

### `.github/workflows/ci-cd.yml`
**Purpose:** GitHub Actions automation workflow  
**What it does:**
1. Triggers on every push to main branch
2. Checks out code
3. Logs into Docker Hub
4. Builds Docker image
5. Pushes image to Docker Hub
6. SSHs into EC2
7. Updates Kubernetes deployment
8. Verifies rollout complete

---

## 🔄 CI/CD Pipeline Workflow

### **Step 1: Developer Push**
Developer writes code and pushes to GitHub
```bash
git push origin main
```

### **Step 2: GitHub Actions Triggered**
Workflow automatically starts (view in Actions tab)

### **Step 3: Build Docker Image**
GitHub Actions builds container from Dockerfile
