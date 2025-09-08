# SRE Monitoring Stack

A **full-stack Site Reliability Engineering (SRE) monitoring platform** that demonstrates end-to-end observability, alerting, and real-time metrics collection.

This repository includes:

- **Node.js App with Metrics**: Tracks HTTP requests (200/400/500), error rates, and latency percentiles (p50, p90, p99).  
- **Prometheus**: Collects and stores all app and system metrics.  
- **Grafana Dashboards**: Visualizes request status distribution, error rates, latency, and system-level metrics.  
- **Alertmanager**: Configured for high error rates and service downtime alerts.  
- **Stress Testing Tools**: Scripts and forced-error endpoints to simulate load and validate alerts.  
- **Docker Compose Setup**: Fully containerized for quick deployment and reproducibility.

---

### 🔧 Key Features

- End-to-end observability pipeline for SRE learning and testing.  
- Demonstrates **SLIs, SLOs, error budgets, and incident alerting**.  
- Designed for **hands-on experience in monitoring, metrics instrumentation, and reliability engineering**.  

---

### 🚀 Quick Start


# Clone the repo
git clone https://github.com/abhilashchauhan1994/sre-monitoring-stack.git
cd sre-monitoring-stack

# Start all services
docker-compose up -d
