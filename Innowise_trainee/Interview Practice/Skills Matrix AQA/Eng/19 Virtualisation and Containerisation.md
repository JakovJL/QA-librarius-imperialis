# Virtualisation and Containerisation

## Table of Contents

- [[#Questions and Answers]]
	- [[#How Do Virtual Machines and Containers Differ?]]
	- [[#Why Are Containers Useful for Development and Test Automation?]]
	- [[#What Are a Docker Image, Container, Base Image, Layer, and Registry?]]
	- [[#What Is the Docker Container Lifecycle?]]
	- [[#How Do You Write a Simple Dockerfile for a Test Environment?]]
	- [[#How Do You Make a Docker Image Small, Fast, and Safer?]]
	- [[#How Do Containers Share Networks, Data, and Test Dependencies?]]
	- [[#How Can Containers Run CI Agents and Browser Tests?]]
	- [[#What Does Ansible Do in a Containerized Environment?]]
	- [[#What Is Container Orchestration and What Does Kubernetes Manage?]]
	- [[#What Are Kubernetes Manifests, Pods, Deployments, Services, ConfigMaps, and Secrets?]]
	- [[#How Does Kubernetes Architecture Work?]]
	- [[#How Do Kubernetes Networking, Remote Docker, and Diagnostics Work?]]
	- [[#How Do CI/CD Pipelines and Kubernetes Compare with Docker Swarm?]]
- [[#Theory Links]]

**Related notes:** [[00 Skills Matrix AQA Index]]

---

## Questions and Answers

### How Do Virtual Machines and Containers Differ?

**Answer:**

A virtual machine emulates a complete computer and runs a guest operating system with its own kernel. A container is an isolated process with the files and dependencies it needs, but containers on one host share the host kernel. VMs give stronger operating-system isolation but use more resources and start more slowly. Containers are lighter and start quickly, but they do not replace a VM when a different kernel or stronger isolation is required.

### Why Are Containers Useful for Development and Test Automation?

**Answer:**

Containers package the same runtime, dependencies, and configuration for a developer, CI job, and test environment. This reduces “works on my machine” failures and lets a suite start an isolated database, API stub, or browser service for one run. They also make cleanup easier: test data and dependencies can be removed with the environment. A container does not make a test deterministic by itself; test data, time, network calls, and external services still need control.

### What Are a Docker Image, Container, Base Image, Layer, and Registry?

**Answer:**

An image is a read-only template used to create containers. A container is a running or stopped instance of an image with its own writable layer. A base image is the starting image in a Dockerfile. Images consist of immutable filesystem layers that can be reused, which speeds up builds and distribution. A registry, such as Docker Hub or a private registry, stores and distributes images. Pin a trusted image version or digest instead of relying on a moving tag such as `latest`.

### What Is the Docker Container Lifecycle?

**Answer:**

A container can be created with `docker create`, started with `docker start`, stopped with `docker stop`, and removed with `docker rm`. `docker run` creates and starts a new container in one command. `docker ps -a`, `docker logs`, and `docker inspect` help check its state and diagnose problems. Stopping a container does not remove it, and removing a container does not remove its image or named volume unless requested separately.

### How Do You Write a Simple Dockerfile for a Test Environment?

**Answer:**

A Dockerfile declares how to build an image. Choose a trusted base image, copy only required files, set a working directory and command, and run as a non-root user when the process does not need root. Keep environment-specific secrets outside the Dockerfile and pass them through the approved secret mechanism at run time.

```dockerfile
FROM eclipse-temurin:21-jre
WORKDIR /tests
COPY target/test-suite.jar app.jar
RUN useradd --system tester
USER tester
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### How Do You Make a Docker Image Small, Fast, and Safer?

**Answer:**

Use a small maintained base image that still contains the required runtime. Pin versions, use `.dockerignore` to exclude build output and secrets, and order Dockerfile instructions so stable dependency layers can be cached. Multi-stage builds keep compilers and build tools out of the final image. Run as a non-root user where possible, scan images, update base images, and never put passwords, tokens, or private keys in an image layer because a deleted file can remain in image history.

### How Do Containers Share Networks, Data, and Test Dependencies?

**Answer:**

Containers on the same Docker network can reach each other by service name; expose a port to the host only when a host process needs it. Use a named volume for data that must survive container replacement, or a bind mount for a deliberate local file share. Docker Compose can describe a small multi-container test environment, such as application, database, and mock service. Each parallel run needs unique names, data, ports, and cleanup so one suite cannot affect another.

### How Can Containers Run CI Agents and Browser Tests?

**Answer:**

A Jenkins agent can run inside a short-lived container so every job gets a known toolchain and is removed after the job. The same idea applies to agents in Azure DevOps, TeamCity, or Bamboo. Selenium Grid and Selenoid can run browser sessions in containers, while the test runner connects remotely. The job must collect reports, screenshots, logs, and videos before cleanup, and it must restrict Docker socket access because that access is highly privileged.

### What Does Ansible Do in a Containerized Environment?

**Answer:**

Ansible uses playbooks to configure hosts and deploy repeatable infrastructure. For example, it can install a container runtime, configure a Docker host, create users and networks, or apply Kubernetes-related setup. It complements Docker and Kubernetes: Docker packages an application, while Ansible configures the machines or services on which that application runs. A playbook should be idempotent, so applying it again reaches the same desired configuration instead of creating duplicates.

### What Is Container Orchestration and What Does Kubernetes Manage?

**Answer:**

Container orchestration manages many containers across machines: scheduling, desired state, restart, scaling, service discovery, rollout, and configuration. Kubernetes is an orchestration system that manages workload objects rather than individual ad-hoc containers. It is useful when a team needs those capabilities at cluster scale; it adds operational complexity and is unnecessary for a single local test dependency.

### What Are Kubernetes Manifests, Pods, Deployments, Services, ConfigMaps, and Secrets?

**Answer:**

A manifest is YAML or JSON that declares desired state. A Pod is the smallest deployable Kubernetes unit and can contain one or closely related containers. A Deployment manages a stateless set of replicated Pods and controlled updates. A Service gives a stable network endpoint for selected Pods. A ConfigMap stores non-sensitive configuration. A Secret is intended for sensitive data, but base64 encoding alone is not encryption; access control and encryption at rest must be configured. An Ingress defines HTTP routing rules and needs an Ingress controller to work.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: test-api
spec:
  replicas: 2
  selector:
    matchLabels:
      app: test-api
  template:
    metadata:
      labels:
        app: test-api
    spec:
      containers:
        - name: api
          image: registry.example/test-api:1.4.2
          ports:
            - containerPort: 8080
```

### How Does Kubernetes Architecture Work?

**Answer:**

A Kubernetes cluster has a control plane and worker nodes. The control plane stores and reconciles desired state; its components include the API server, scheduler, controller manager, and `etcd`, the consistent key-value store for cluster data. A worker node runs Pods. `kubelet` is the node agent that makes sure assigned Pods run, and `kube-proxy` implements part of Service networking on many clusters. “Master node” is an older informal name; “control plane” is the current term.

### How Do Kubernetes Networking, Remote Docker, and Diagnostics Work?

**Answer:**

Kubernetes networking normally gives each Pod an IP address. A CNI plugin implements the cluster network, a Service gives stable access to Pods, and an Ingress routes HTTP(S) traffic from outside the cluster. To diagnose a failure, inspect Pod status and events, container logs, readiness and liveness probes, resource limits, DNS, Service endpoints, and network policies. `DOCKER_HOST` or `docker -H` can point the Docker CLI to a remote daemon, but it must use protected access such as TLS; exposing an unauthenticated Docker daemon can give full host control.

### How Do CI/CD Pipelines and Kubernetes Compare with Docker Swarm?

**Answer:**

A container CI/CD pipeline builds an image, runs tests and scans, publishes an immutable version to a registry, deploys the declared version, waits for readiness, and retains evidence for rollback or diagnosis. Kubernetes can create dynamic CI agents and test namespaces, but the pipeline must clean them up and avoid sharing secrets. Docker Swarm is simpler to set up for smaller deployments; Kubernetes has a larger ecosystem and more control for complex, multi-team workloads, but needs more operational skill. Choose from the deployment needs, not from popularity.

---

## Theory Links

- [[22 Docker and Test Environments]]
