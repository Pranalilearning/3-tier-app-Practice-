# Comprehensive Project Context: Cloud-Native AWS Application

> **Document Type:** Definitive Technical Architecture and Implementation Specification  
> **Target Audience:** External AI Systems, Cloud Architects, and Technical Interviewers  
> **Source Repository:** `tanyaverma20/Cloud-Native-AWS-Application`  
> **Primary Source of Truth:** Verified Repository Source Code, Docker Configurations, Terraform Modules, CI/CD Workflows, and Test Suites.  
> **Security Status:** All credentials, keys, and tokens sanitized; placeholders used throughout.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Project Goals and Problem Statement](#2-project-goals-and-problem-statement)
3. [Technology Stack Inventory](#3-technology-stack-inventory)
4. [Complete Repository Structure](#4-complete-repository-structure)
5. [System Architecture](#5-system-architecture)
6. [End-to-End System Workflows](#6-end-to-end-system-workflows)
7. [Feature-by-Feature Breakdown](#7-feature-by-feature-breakdown)
8. [Frontend Architecture](#8-frontend-architecture)
9. [Backend Architecture](#9-backend-architecture)
10. [API Documentation](#10-api-documentation)
11. [Database Architecture](#11-database-architecture)
12. [Authentication and Authorization](#12-authentication-and-authorization)
13. [AI / ML Architecture Analysis](#13-ai--ml-architecture-analysis)
14. [LLM / Generative AI Architecture Analysis](#14-llm--generative-ai-architecture-analysis)
15. [RAG Architecture Analysis](#15-rag-architecture-analysis)
16. [Agent / Agentic AI Architecture Analysis](#16-agent--agentic-ai-architecture-analysis)
17. [AI/ML Application Integration Analysis](#17-aiml-application-integration-analysis)
18. [Detailed Data Flows](#18-detailed-data-flows)
19. [Important Classes, Functions, and Modules](#19-important-classes-functions-and-modules)
20. [Configuration Management](#20-configuration-management)
21. [Environment Variables Directory](#21-environment-variables-directory)
22. [External Services and APIs](#22-external-services-and-apis)
23. [Error Handling and Resilience](#23-error-handling-and-resilience)
24. [Security Posture and Hardening](#24-security-posture-and-hardening)
25. [CORS, Nginx, and Reverse Proxy Configuration](#25-cors-nginx-and-reverse-proxy-configuration)
26. [Docker and Containerization Strategy](#26-docker-and-containerization-strategy)
27. [Build and Runtime Processes](#27-build-and-runtime-processes)
28. [Testing Suite and Quality Assurance](#28-testing-suite-and-quality-assurance)
29. [Performance and Optimization Mechanisms](#29-performance-and-optimization-mechanisms)
30. [Important Design Decisions](#30-important-design-decisions)
31. [Technical Trade-offs](#31-technical-trade-offs)
32. [Current System Limitations](#32-current-system-limitations)
33. [Known Issues, Anomalies, and Codebase Observations](#33-known-issues-anomalies-and-codebase-observations)
34. [Important Constants and Business Rules](#34-important-constants-and-business-rules)
35. [Complete Module Dependency Map](#35-complete-module-dependency-map)
36. [Important Runtime Sequences](#36-important-runtime-sequences)
37. [Interview Perspective and Technical Defense](#37-interview-perspective-and-technical-defense)
38. [Project Knowledge Checklist for AI Systems](#38-project-knowledge-checklist-for-ai-systems)
39. [Source-of-Truth and Verification Rules](#39-source-of-truth-and-verification-rules)
40. [Final Technical Summary](#40-final-technical-summary)

---

## 1. Project Overview

### 1.1 Identifiers and Essence
- **Repository Name:** `Cloud-Native-AWS-Application`
- **Infrastructure Project Identifier:** `cloudapp` (defined across Terraform variables, security group names, RDS identifiers, and Docker Compose configurations)
- **Primary Paradigm:** 3-Tier Decoupled Web Application & Automated Cloud-Native Infrastructure

### 1.2 Purpose and Problem Being Solved
This project bridges the gap between local full-stack web development and enterprise cloud deployment. It provides a production-grade blueprint for deploying containerized micro-services and web applications to Amazon Web Services (AWS) using modern DevOps methodologies:
1. **Containerization:** Encapsulating dependencies into minimal, secure Alpine Linux containers.
2. **Infrastructure as Code (IaC):** Codifying multi-tier AWS Virtual Private Cloud (VPC) networking, compute, managed databases, load balancers, and security groups using modular Terraform.
3. **Decoupled Architecture:** Separating a React single-page frontend (SPA), a Node.js/Express REST API, and a PostgreSQL relational database.
4. **Automated Continuous Integration and Deployment (CI/CD):** Deploying code changes via GitHub Actions through keyless AWS IAM OpenID Connect (OIDC) authentication, eliminating static API access keys.

### 1.3 Target Audience and Primary Use Cases
- **Target Audience:** DevOps Engineers, Cloud Architects, and Full-Stack Developers seeking a clean, production-aligned AWS reference architecture.
- **Main Use Cases:**
  - Running a resilient CRUD/inventory list web dashboard.
  - Demonstrating zero-downtime rolling updates using AWS ECS Fargate and Application Load Balancers.
  - Validating container health probing and automated target group routing.
  - Provisioning secure, multi-AZ cloud infrastructure with strict network tier isolation.

### 1.4 Explanations

#### One-Sentence Explanation
> A containerized 3-tier web application combining a React 19 frontend, an Express 5 REST API, and a PostgreSQL database, provisioned across multi-AZ isolated subnets in AWS using modular Terraform and continuously deployed to ECS Fargate via GitHub Actions with keyless AWS OIDC authentication.

#### Interview-Ready Explanation (30–60 Seconds)
> "Cloud-Native AWS Application is an end-to-end cloud engineering implementation designed to showcase modern cloud architecture and automated delivery. On the application side, it features a decoupled React single-page application communicating via Axios with a hardened Express.js REST API that persists data to PostgreSQL using connection pooling and parameterized queries. On the cloud side, the entire infrastructure is codified in Terraform across a 3-tier VPC with public, private, and database subnets. The backend runs as serverless containers on AWS ECS Fargate behind an Application Load Balancer, while the database is hosted on Amazon RDS PostgreSQL with credentials managed dynamically via AWS Secrets Manager. Finally, deployment is fully automated through a GitHub Actions pipeline utilizing OpenID Connect for keyless authentication to build, scan, push to ECR, and execute rolling updates on ECS."

#### Detailed Technical Explanation
The application consists of three primary operational tiers:
1. **Presentation Tier:** A React 19 Single Page Application packaged using a multi-stage Docker build (Vite compilation in Node 20 Alpine followed by static asset serving via Nginx Alpine with client-side SPA route fallbacks).
2. **Application Tier:** An Express.js 5 REST API running on Node.js 20 Alpine. It applies HTTP security headers via `helmet`, parses incoming JSON, enforces CORS policies, provides development request logging via `morgan`, validates payloads using `express-validator`, exposes process telemetry at `/api/metrics`, and provides an active database readiness probe at `/health`.
3. **Data Tier:** PostgreSQL (version 18.4 locally in Docker Compose; version 15 on Amazon RDS). Data persistence is centered on an `items` table with a generated identity primary key. Database connectivity is managed through a pooled `pg.Pool` connection pool with parameter binding (`$1`) for injection prevention.
4. **Cloud Infrastructure:** Codified in Terraform 1.5+ utilizing AWS Provider 5.0+. The architecture spans an AWS VPC (`10.0.0.0/16`) across two Availability Zones (`ap-south-1a` and `ap-south-1b`), partitioned into:
   - **Public Subnets:** Housing an Internet Gateway, NAT Gateway with Elastic IP, and an internet-facing Application Load Balancer.
   - **Private Subnets:** Housing AWS ECS Fargate tasks with no public IP addresses, egressing to the internet through the NAT Gateway.
   - **Database Subnets:** Housing Amazon RDS PostgreSQL in an isolated DB Subnet Group with strictly no internet routing.
5. **Security & Deployment:** Ingress is guarded by chained security groups (ALB SG -> ECS SG -> RDS SG). CI/CD is driven by GitHub Actions pushing to Amazon ECR and updating ECS task definitions via temporary STS credentials generated by an OIDC federation role.

---

## 2. Project Goals and Problem Statement

### 2.1 Motivation and Business Problem
Traditional web applications often suffer from the "works on my machine" syndrome, manual error-prone cloud configurations, security vulnerabilities stemming from hardcoded credentials, and publicly exposed database instances. This project was developed to establish:
- **Reproducibility:** A parity-driven local environment (Docker Compose) and cloud deployment (Terraform + ECS).
- **Network Segmentation:** Defense-in-depth where compute and storage are unreachable from the public internet.
- **Credential Hygiene:** Eradicating long-lived IAM access keys and hardcoded database passwords through AWS OIDC and AWS Secrets Manager.
- **Zero-Downtime Releases:** Rolling deployment workflows that verify container stability before traffic shift.

### 2.2 System In-Scope vs. Out-of-Scope

| Category | In-Scope (Implemented in Repository) | Out-of-Scope (Not Implemented) |
|---|---|---|
| **Data Operations** | List items (`GET`), Create items (`POST`), DB ping (`SELECT 1`) | Update (`PUT/PATCH`), Delete (`DELETE`), Bulk import, Pagination, Search |
| **Telemetry** | Uptime, Memory usage (`rss`, `heapTotal`, `heapUsed`), DB connectivity status | Distributed tracing (OpenTelemetry/X-Ray), Prometheus scrapers, Custom CloudWatch alarms |
| **Authentication** | Network-level SG isolation, AWS IAM execution roles, OIDC token exchange | User registration, Login, JWT tokens, Session cookies, RBAC, OAuth2/Cognito |
| **AI / ML** | None | Model inference, Vector search, RAG pipelines, LLM agent workflows |
| **Frontend Cloud Hosting** | Docker container with Nginx configuration provided | S3 + CloudFront static hosting module (explored manually in docs, but not in Terraform) |

### 2.3 Input and Output Specifications
- **Inputs:**
  - HTTP GET requests to `/`, `/health`, `/api/metrics`, `/api/items/getitems`.
  - HTTP POST requests to `/api/items/createitems` containing JSON: `{"name": "string"}`.
  - Terraform input variables (`aws_region`, `project_name`, `environment`, `db_password`, `db_username`, `db_name`, `backend_image`).
  - GitHub Actions environment variables and OIDC claims.
- **Outputs:**
  - JSON API payloads (`{ success: true, count: n, data: [...] }`).
  - HTTP status codes: `200 OK`, `201 Created`, `400 Bad Request`, `503 Service Unavailable`, `500 Internal Server Error`.
  - Compiled static HTML/CSS/JS frontend bundles.
  - AWS CloudWatch container logs (`/ecs/cloudapp-backend`).
  - Immutable Docker images tagged with Git commit SHAs in Amazon ECR.

---

## 3. Technology Stack Inventory

### 3.1 Language, Framework, and Library Inventory

| Technology | Category | Exact Version / Spec | File Where Declared | Architectural Role and Purpose |
|---|---|---|---|---|
| **JavaScript (Node.js)** | Runtime | `20-alpine` (Docker) | `backend/Dockerfile`, `.github/workflows/deploy.yml` | Server-side runtime executing the backend REST API. |
| **Express.js** | Backend Web Framework | `^5.2.1` | `backend/package.json` | Core routing, middleware pipeline, and HTTP server lifecycle. |
| **pg (`node-postgres`)** | Database Client | `^8.21.0` | `backend/package.json` | PostgreSQL driver providing connection pooling (`pg.Pool`) and parameterized queries. |
| **express-validator** | Input Validation | `^7.3.2` | `backend/package.json` | Request payload schema validation and sanitization middleware. |
| **helmet** | HTTP Security | `^8.1.0` | `backend/package.json` | Sets HTTP response headers (HSTS, CSP, X-Frame-Options) for defense against web vulnerabilities. |
| **cors** | Middleware | `^2.8.6` | `backend/package.json` | Handles Cross-Origin Resource Sharing headers for browser clients. |
| **morgan** | Logging Middleware | `^1.10.1` | `backend/package.json` | Formats and outputs HTTP access logs in development mode. |
| **dotenv** | Configuration Loader | `^17.4.2` | `backend/package.json` | Loads environment variables from local `.env` files into `process.env`. |
| **React** | Frontend UI Framework | `^19.2.6` | `frontend/package.json` | Declarative UI component tree and state management. |
| **React DOM** | DOM Renderer | `^19.2.6` | `frontend/package.json` | Mounts React components into the browser DOM (`#root`). |
| **React Router DOM** | Client Routing | `^7.15.1` | `frontend/package.json` | Browser routing provider (`BrowserRouter`, `Routes`, `Route`). |
| **Axios** | HTTP Client | `^1.16.1` | `frontend/package.json` | Promise-based HTTP client for issuing API requests with pre-configured baseURL. |
| **Vite** | Build Tool / Dev Server | `^8.0.12` | `frontend/package.json` | Fast ES-module development server and rollup-based production asset bundler. |
| **@vitejs/plugin-react**| Vite Plugin | `^6.0.1` | `frontend/package.json` | Provides Fast Refresh and Babel/SWC JSX transformation for React. |
| **PostgreSQL** | Relational Database | `15` (RDS) / `18.4` (Compose) | `terraform/modules/database/main.tf`, `docker-compose.yml` | ACID-compliant relational data store for persistent item storage. |
| **Nginx** | Web Server / Reverse Proxy | `alpine` | `frontend/Dockerfile`, `frontend/nginx.conf` | Production HTTP web server serving compiled static React SPA bundles with route fallbacks. |
| **Docker** | Containerization | Alpine base images | `backend/Dockerfile`, `frontend/Dockerfile` | Standardizes development and deployment environments into OCI container images. |
| **Docker Compose** | Multi-Container Orchestration| v2 format | `docker-compose.yml` | Orchestrates local DB, backend, and frontend containers on an isolated bridge network. |
| **Terraform** | Infrastructure as Code | `>= 1.5` | `terraform/versions.tf` | Declarative cloud provisioning tool managing AWS resources. |
| **AWS Provider (Terraform)**| IaC Provider | `~> 5.0` | `terraform/versions.tf` | Terraform provider plugin interfacing with the AWS API. |
| **Random Provider (Terraform)**| IaC Provider | `~> 3.6` | `terraform/versions.tf` | Declared in versions block for random resource generation. |
| **Jest** | Test Runner / Assertions | `^30.4.2` | `backend/package.json`, root `package.json` | Executes backend unit/API and PostgreSQL integration test suites serially (`--runInBand`). |
| **Supertest** | API Integration Testing | `^7.2.2` | `backend/package.json` | Simulates HTTP requests against the Express `app` instance without network port binding. |
| **Vitest** | Frontend Test Runner | `^5.0.4` | `frontend/package.json` | Fast Vite-native unit and component test runner with ESM and JSDOM support. |
| **@testing-library/react** | Component Testing | `^16.3.3` | `frontend/package.json` | Renders React components and simulates user interactions following accessible DOM queries. |
| **@testing-library/jest-dom** | Custom Matchers | `^7.0.1` | `frontend/package.json` | Extends Vitest/Jest expect with DOM-specific assertions (`toBeInTheDocument`, etc.). |
| **@testing-library/user-event** | User Interaction | `^14.6.8` | `frontend/package.json` | Simulates realistic browser user dispatch events (typing, clicking, clearing). |
| **jsdom** | DOM Simulation | `^29.1.1` | `frontend/package.json` | Headless DOM and browser environment implementation for Node.js test execution. |
| **Nodemon** | Dev Utility | `^3.1.14` | `backend/package.json` | Watches backend files and automatically restarts the Node server upon code changes. |
| **ESLint** | Static Analysis | `^10.3.0` | `frontend/package.json` | Lints frontend JSX/JavaScript code for syntax and best practices. |
| **GitHub Actions** | CI/CD Platform | Cloud runner (`ubuntu-latest`) | `.github/workflows/deploy.yml` | Executes automated build, test, container push, and ECS deployment pipeline. |

---

## 4. Complete Repository Structure

```text
Cloud-Native-AWS-Application/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions CI/CD pipeline (Parallel Quality Gates: Backend, Frontend, Terraform -> Deploy ECS)
├── .gitignore                      # Git ignore patterns (node_modules, coverage, logs, terraform state, secrets)
├── docker-compose.yml              # Local 3-tier container orchestration (postgres-db, backend, frontend)
├── docker-compose.test.yml         # Dedicated isolated PostgreSQL test service container for integration tests
├── package-lock.json               # Root lockfile (locks root devDependencies)
├── package.json                    # Root package manifest (scripts for full-stack testing, linting, building)
├── README.md                       # Comprehensive markdown documentation and architecture walk-through
├── CONTEXT.md                      # This exhaustive technical specification and AI context document
├── instruction.md                  # Comprehensive engineering bootcamp tutorial and instructional guide
├── backend/
│   ├── .dockerignore               # Ignores node_modules, npm logs, and local env files from Docker build
│   ├── .gitignore                  # Backend-specific ignore file (.env, node_modules, coverage)
│   ├── Dockerfile                  # Single-stage Node 20 Alpine container image definition
│   ├── package-lock.json           # Backend dependency lockfile
│   ├── package.json                # Backend scripts (start, dev, test, test:unit, test:integration, test:coverage)
│   ├── server.js                   # HTTP entrypoint; calls app.listen() using port from env config
│   ├── src/
│   │   ├── app.js                  # Express app setup, middleware pipeline, 404 catch-all, and router mounting
│   │   ├── config/
│   │   │   └── env.js              # Environment parser using dotenv; exports nodeEnv, port, db config
│   │   ├── controllers/
│   │   │   └── itemController.js   # Handlers: getItems (SELECT *), createItems (INSERT RETURNING * with trimmed names)
│   │   ├── db/
│   │   │   ├── index.js            # pg.Pool instantiation with event listeners (connect, error)
│   │   │   └── schema.sql          # DDL script defining the items table schema
│   │   ├── middleware/
│   │   │   ├── errorHandler.js     # Centralized error handler returning sanitized 500 responses without leaking SQL/secrets
│   │   │   └── validate.js         # Evaluates express-validator results; returns 400 on error
│   │   ├── routes/
│   │   │   ├── healthRoutes.js     # GET /health; executes SELECT 1 to verify database readiness
│   │   │   ├── itemRoutes.js       # Routes: GET /getitems, POST /createitems
│   │   │   └── metricRoutes.js     # GET /api/metrics; returns uptime, memoryUsage, and timestamp
│   │   └── validators/
│   │       └── itemValidator.js    # Express-validator chain: exists().bail().isString().trim().notEmpty().isLength(2,100)
│   └── tests/
│       ├── health.test.js          # Supertest/Jest tests for /health, /, /api/metrics, 404, and malformed JSON
│       ├── items.test.js           # Supertest/Jest tests for /api/items (empty/multi lists, trimming, 2-100 boundaries, DB failure)
│       └── integration/
│           ├── dbTestHelper.js     # Dedicated test DB pool, safety guard enforcing "test" in DB name, schema executor
│           └── items.integration.test.js # Real PostgreSQL integration tests (schema, identity IDs, constraints, SQL injection, E2E)
├── frontend/
│   ├── .dockerignore               # Ignores node_modules, dist, and local env files from Docker build
│   ├── .gitignore                  # Frontend ignore file (dist, node_modules, .env.local)
│   ├── Dockerfile                  # Multi-stage Dockerfile (Node 20 Alpine builder -> Nginx Alpine runner)
│   ├── eslint.config.js            # Flat ESLint configuration with React hooks and refresh plugins
│   ├── index.html                  # HTML5 entrypoint housing <div id="root"></div>
│   ├── nginx.conf                  # Nginx server block with try_files $uri $uri/ /index.html fallback
│   ├── package-lock.json           # Frontend dependency lockfile
│   ├── package.json                # Frontend scripts (dev, build, lint, preview, test, test:watch) and dependencies
│   ├── vite.config.js              # Vite & Vitest configuration enabling React plugin and JSDOM environment
│   ├── public/
│   │   ├── favicon.svg             # Application SVG icon
│   │   └── icons.svg               # Additional SVG icon sprite asset
│   └── src/
│       ├── App.jsx                 # Top-level React routing component mapping routes and managing notification state
│       ├── index.css               # Design system tokens, CSS variables, dark-mode, typography
│       ├── main.jsx                # React root mount (ReactDOM.createRoot) wrapping App in BrowserRouter
│       ├── setupTests.js           # Vitest setup configuring @testing-library/jest-dom matchers
│       ├── __tests__/
│       │   ├── App.test.jsx        # End-to-end component workflow tests with mocked Axios (load, create, error alert)
│       │   ├── ItemComponents.test.jsx # Unit tests for ItemForm (trimming, blank input) and ItemList components
│       │   ├── ItemFormModal.test.jsx  # Modal form validation (<2 chars, >100 chars, whitespace), spinner, keyboard close
│       │   └── ItemTable.test.jsx  # Table rendering, loading state, error state with retry, empty state, and search filter
│       ├── api/
│       │   ├── healthApi.js        # Health status API integration layer calling /health via Axios
│       │   └── itemsApi.js         # API integration layer calling backend endpoints via Axios
│       ├── components/
│       │   ├── ItemForm.jsx        # Controlled input form component for creating items
│       │   ├── ItemList.jsx        # Render component displaying array of items
│       │   ├── common/             # AlertBanner, badges, and shared UI components
│       │   ├── items/              # ItemTable, ItemFormModal components
│       │   └── layout/             # Layout, header, sidebar navigation components
│       ├── pages/
│       │   ├── OverviewPage.jsx    # System metrics and operational summary
│       │   ├── ItemsPage.jsx       # Item management view with ItemTable and notification banner
│       │   ├── InfrastructurePage.jsx # Container and network topology view
│       │   ├── ActivityPage.jsx    # Audit activity timeline
│       │   └── SettingsPage.jsx    # Configuration settings view
│       ├── services/
│       │   └── api.js              # Axios instance factory configured with import.meta.env.VITE_API_URL
│       └── styles/
│           └── global.css          # Minimal global reset and baseline body styles
├── terraform/
│   ├── main.tf                     # Root Terraform module composing networking, security, database, compute
│   ├── outputs.tf                  # Infrastructure outputs: alb_dns_name, ecr_url, ecs names, db_endpoint
│   ├── providers.tf                # AWS provider declaration configured with var.aws_region
│   ├── variables.tf                # Root input variables with defaults and sensitive flags
│   ├── versions.tf                 # Pinned Terraform core (>= 1.5) and provider versions (~> 5.0)
│   └── modules/
│       ├── compute/
│       │   ├── main.tf             # ECR repo, CloudWatch logs, IAM roles, ECS cluster, ALB, target group, service
│       │   ├── outputs.tf          # Exported compute attributes (alb_dns_name, ecr_url, ecs names)
│       │   └── variables.tf        # Compute inputs (vpc_id, subnets, SGs, db_host, db_secret_arn, image)
│       ├── database/
│       │   ├── main.tf             # aws_db_subnet_group, Secrets Manager secret/version, aws_db_instance
│       │   ├── outputs.tf          # Exported database attributes (db_endpoint, db_host, secret_arn)
│       │   └── variables.tf        # Database inputs (subnet_ids, security_group_id, credentials)
│       ├── networking/
│       │   ├── main.tf             # VPC, 6 subnets across 2 AZs, IGW, EIP, NAT Gateway, 3 Route Tables
│       │   ├── outputs.tf          # Exported networking attributes (vpc_id, subnet ID lists)
│       │   └── variables.tf        # Networking inputs (project_name, environment)
│       └── security/
│           ├── main.tf             # Tiered Security Groups: alb_sg (80, 443), ecs_sg (3000), rds_sg (5432)
│           ├── outputs.tf          # Exported security group IDs (alb_sg_id, ecs_sg_id, rds_sg_id)
│           └── variables.tf        # Security inputs (vpc_id, project_name)
└── docs/                           # Architecture diagrams, deployment evidence, and verification logs
    ├── alb-target-group.png
    ├── alb.jpg
    ├── architecture-diagram-2.png
    ├── architecture-diagram.png
    ├── cloudfront-distribution.png
    ├── cloudfront-edited.png
    ├── cloudwatch-logs.png
    ├── deployment-steps.md         # Narrative log of deployment milestones and skills acquired
    ├── ecr-photo.png
    ├── ecs-photo.png
    ├── outputjson.png
    ├── rds.png
    └── s3-hosting.png
```

---

## 5. System Architecture

### 5.1 High-Level Architecture Overview
The application architecture enforces strict physical and logical boundary separation across three tiers. In AWS, compute tasks run in private subnets with zero direct inbound internet access; external ingress is mediated solely by an Application Load Balancer. In local development, Docker Compose replicates this separation across an internal bridge network.

### 5.2 ASCII Architecture Diagrams

#### Production Cloud Architecture on AWS
```text
                          INTERNET (Web Clients / Browsers)
                                          │
                                          │ HTTP :80
                                          ▼
   ┌─────────────────────────────────────────────────────────────────────────────┐
   │ AWS VIRTUAL PRIVATE CLOUD (VPC: 10.0.0.0/16) - Region: ap-south-1           │
   │                                                                             │
   │ ┌─────────────────────────────────────────────────────────────────────────┐ │
   │ │ PUBLIC TIER (Internet Gateway Enabled)                                  │ │
   │ │                                                                         │ │
   │ │   [Public Subnet A: 10.0.1.0/24]         [Public Subnet B: 10.0.2.0/24] │ │
   │ │   ├── NAT Gateway (Elastic IP)           └── Application Load Balancer  │ │
   │ │   └── Application Load Balancer              (ALB Listener Port 80)     │ │
   │ │       (ALB Listener Port 80)                         │                  │ │
   │ └───────────────────────┬──────────────────────────────┼──────────────────┘ │
   │                         │ Inbound Port 3000            │                    │
   │                         │ Restricted to ALB SG         │                    │
   │                         ▼                              ▼                    │
   │ ┌─────────────────────────────────────────────────────────────────────────┐ │
   │ │ PRIVATE APPLICATION TIER (No Public IPs; Outbound via NAT Gateway)      │ │
   │ │                                                                         │ │
   │ │   [Private Subnet A: 10.0.11.0/24]       [Private Subnet B: 10.0.12.0/24│ │
   │ │   ├── ECS Fargate Task (Container)       └── ECS Fargate Task           │ │
   │ │   │   • Express API (Port 3000)              • Express API (Port 3000)  │ │
   │ │   │   • CloudWatch Log Stream                • CloudWatch Log Stream    │ │
   │ │   │   • IAM Execution & Task Roles           • IAM Roles                │ │
   │ └───────────────────────┬──────────────────────────────┼──────────────────┘ │
   │                         │ Inbound Port 5432            │                    │
   │                         │ Restricted to ECS SG         │                    │
   │                         ▼                              ▼                    │
   │ ┌─────────────────────────────────────────────────────────────────────────┐ │
   │ │ ISOLATED DATABASE TIER (Non-Routable Subnets; No Internet Access)       │ │
   │ │                                                                         │ │
   │ │   [DB Subnet A: 10.0.21.0/24]            [DB Subnet B: 10.0.22.0/24]    │ │
   │ │   └─────────────────────────┬────────────────────────┘                  │ │
   │ │                             ▼                                           │ │
   │ │               Amazon RDS PostgreSQL 15 Instance                         │ │
   │ │               • Port 5432, KMS Storage Encryption                       │ │
   │ │               • DB Subnet Group: cloudapp-db-subnet-group               │ │
   │ └─────────────────────────────────────────────────────────────────────────┘ │
   └─────────────────────────────────────────────────────────────────────────────┘
                                  ▲
                                  │ Credentials Injection
                                  │ (DB_USER, DB_PASSWORD)
                     ┌────────────┴─────────────┐
                     │   AWS Secrets Manager    │
                     │  (cloudapp-db-secret)    │
                     └──────────────────────────┘
```

#### Local Container Topology (Docker Compose)
```text
                         Host Machine Web Browser
                                    │
               ┌────────────────────┴────────────────────┐
               │ Host Port :5000                         │ Host Port :3000
               ▼                                         ▼
   ┌───────────────────────┐                 ┌───────────────────────┐
   │  frontend container   │                 │   backend container   │
   │  (Nginx Alpine: :80)  │                 │  (Express Node: :3000)│
   │  Serves Vite Dist SPA │                 │  App & Health Endpts  │
   └───────────┬───────────┘                 └───────────┬───────────┘
               │                                         │
               │ HTTP API Calls (Axios)                  │ pg.Pool
               │ baseURL: http://localhost:3000          │ Port 5432
               └────────────────────────────────────────►│
                                                         ▼
                                             ┌───────────────────────┐
                                             │ postgres-db container │
                                             │ (PostgreSQL 18.4)     │
                                             │ schema.sql initialized│
                                             └───────────────────────┘
                     Docker Bridge Network (`app-network`)
```

---

## 6. End-to-End System Workflows

### 6.1 Application Startup Workflow (Cloud ECS Fargate)
1. **ECS Deployment Trigger:** ECS initiates task launch within `private-a` or `private-b` based on desired task count.
2. **IAM Task Execution:** The AWS ECS Agent assumes the `cloudapp-ecs-execution` IAM role.
3. **Secret Resolution:** ECS queries AWS Secrets Manager for secret `cloudapp-db-secret`. It retrieves JSON keys `username` and `password` and binds them to container environment variables `DB_USER` and `DB_PASSWORD`.
4. **Image Pull:** ECS pulls the immutable Docker image from `aws_ecr_repository.backend` (`cloudapp-backend:<tag>`) via the NAT Gateway.
5. **Container Initialization:** Docker launches the container running `npm start` -> `node server.js`.
6. **Environment Parsing:** `backend/src/config/env.js` parses variables (`NODE_ENV=production`, `PORT=3000`, `DB_HOST`, `DB_PORT=5432`, `DB_NAME`, `DB_SSL=true`).
7. **Connection Pool Initialization:** `backend/src/db/index.js` instantiates `new Pool({...})`. With `DB_SSL=true`, TLS is configured as `{ rejectUnauthorized: false }`.
8. **HTTP Listener:** `server.js` starts the Express server listening on `0.0.0.0:3000`.
9. **Container Health Checking:** Docker executes the internal task health check:
   `node -e "require('http').get('http://127.0.0.1:3000/health', r => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"`
10. **ALB Registration:** Upon passing internal health checks, the task registers with `aws_lb_target_group.backend`.
11. **ALB Health Probing:** The ALB sends periodic HTTP GET requests to `/health`. Once 2 consecutive 200 OK responses are received, the task transitions to `healthy` and begins receiving public traffic.

### 6.2 User Item Retrieval Workflow (`GET /api/items/getitems`)
1. **User Action:** The user navigates to the application dashboard in their browser.
2. **React Mount:** `HomePage.jsx` mounts and executes its empty-dependency `useEffect` hook.
3. **API Invocation:** `HomePage.jsx` calls `fetchItems()`, which triggers `getItems()` in `frontend/src/api/itemsApi.js`.
4. **HTTP Dispatch:** Axios sends `GET /api/items/getitems` to `VITE_API_URL` (in cloud deployments, the ALB DNS name).
5. **Network Ingress:** The ALB receives traffic on port 80, inspects target group availability, and forwards the request to an ECS task in the private subnet on port 3000.
6. **Middleware Pipeline:**
   - `helmet()` adds security headers (`X-DNS-Prefetch-Control`, `X-Frame-Options`, `Strict-Transport-Security`, etc.).
   - `cors()` validates the cross-origin request.
   - `express.json()` confirms empty body.
   - `morgan("dev")` logs the incoming request (omitted in test environment).
7. **Router Dispatch:** Express matches route `/api/items` in `app.js` and sub-route `/getitems` in `itemRoutes.js`.
8. **Controller Execution:** `getItems` in `itemController.js` executes:
   ```javascript
   const result = await pool.query("SELECT * FROM items");
   ```
9. **Database Query:** The pooled PostgreSQL connection executes `SELECT * FROM items` over port 5432 against Amazon RDS.
10. **Result Packaging:** The controller formats the response:
    ```json
    { "success": true, "count": 2, "data": [{ "id": "1", "name": "Item A" }, { "id": "2", "name": "Item B" }] }
    ```
11. **HTTP Response:** Express returns `200 OK` with JSON payload back through the ALB to the browser.
12. **React UI Update:** `HomePage.jsx` receives `response.data.data`, updates `setItems(data)`, sets `setLoading(false)`, and `ItemList.jsx` maps over items rendering each name.

### 6.3 User Item Creation Workflow (`POST /api/items/createitems`)
1. **User Input:** The user types `"Production Item"` into `ItemForm.jsx` and clicks "Add Item".
2. **Form Submission:** `ItemForm.jsx` intercepts `onSubmit`, prevents page refresh, trims whitespace, verifies non-empty input, invokes `onAdd({ name: "Production Item" })`, and clears the text input.
3. **Page Handler:** `HomePage.jsx` calls `createItem({ name: "Production Item" })` in `itemsApi.js`.
4. **HTTP Post:** Axios sends `POST /api/items/createitems` with body `{"name": "Production Item"}`.
5. **Network Routing:** The ALB forwards the POST request to an active ECS task on port 3000.
6. **Middleware Execution:**
   - Security middleware (`helmet`, `cors`) process headers.
   - `express.json()` parses the request body into `req.body`.
7. **Validation Stage:**
   - `createItemValidation` in `itemValidator.js` executes `body("name").trim().notEmpty().isLength({ min: 2, max: 100 })`.
   - `validate` middleware in `validate.js` evaluates `validationResult(req)`.
   - If validation fails: returns `400 Bad Request` with `{ success: false, errors: [...] }`.
   - If validation succeeds: calls `next()`.
8. **Controller Execution:** `createItems` in `itemController.js` extracts `{ name } = req.body` and executes:
   ```javascript
   const result = await pool.query("INSERT INTO items (name) VALUES ($1) RETURNING *", [name]);
   ```
9. **Database Persistence:** PostgreSQL inserts the record, assigns an auto-generated identity `id`, and returns the created row.
10. **Controller Response:** Returns `201 Created` with:
    ```json
    { "success": true, "data": { "id": "3", "name": "Production Item" } }
    ```
11. **State Update:** `HomePage.jsx` receives the newly created item and updates state: `setItems([...items, newItem])`.
12. **DOM Re-render:** React renders the newly added item at the end of `ItemList.jsx`.

---

## 7. Feature-by-Feature Breakdown

### Feature 1: Dynamic Item Listing
- **Purpose:** Fetches and displays all persisted inventory records.
- **Frontend File:** `frontend/src/pages/HomePage.jsx`, `frontend/src/components/ItemList.jsx`, `frontend/src/api/itemsApi.js`.
- **Backend File:** `backend/src/routes/itemRoutes.js`, `backend/src/controllers/itemController.js`.
- **Database Interaction:** Executes `SELECT * FROM items` against PostgreSQL `items` table.
- **Edge Cases & Failure Handling:** If the database connection drops, the controller catches the error, logs it to `console.error`, and returns `500 { error: "Internal Server Error" }`. The frontend catches the exception and renders `<p>Failed to fetch items</p>`.

### Feature 2: Validated Item Creation
- **Purpose:** Sanitizes, validates, and persists new named items.
- **Frontend File:** `frontend/src/components/ItemForm.jsx`, `frontend/src/api/itemsApi.js`.
- **Backend File:** `backend/src/validators/itemValidator.js`, `backend/src/middleware/validate.js`, `backend/src/controllers/itemController.js`.
- **Validation Constraints:** Name must be non-empty after trimming and must have a length between 2 and 100 characters.
- **Database Interaction:** Parameterized SQL insertion: `INSERT INTO items (name) VALUES ($1) RETURNING *`.
- **Edge Cases & Failure Handling:** If string length is `< 2` or `> 100`, validation rejects the request before hitting the database, returning `400 Bad Request`. If the DB query fails, the controller calls `next(error)` which forwards to `errorHandler.js` returning `500 { success: false, message: "Internal Server Error" }`.

### Feature 3: Database Readiness & Health Probing
- **Purpose:** Provides a deep health probe evaluating both the Node.js runtime and PostgreSQL connectivity. Used by ECS container health checks and ALB target group health checks.
- **Backend File:** `backend/src/routes/healthRoutes.js`.
- **Endpoint:** `GET /health`.
- **Execution Path:** Executes `await pool.query("SELECT 1")`.
- **Success Response:** `200 OK` -> `{ status: "OK", uptime: <seconds>, timestamp: <ISO string> }`.
- **Failure Response:** `503 Service Unavailable` -> `{ status: "UNAVAILABLE", message: "Database is unavailable" }`.
- **Significance:** Ensures that if the database is unreachable, the ALB stops routing traffic to the container and ECS marks the task as unhealthy.

### Feature 4: Process Telemetry & Metrics
- **Purpose:** Exposes Node.js process runtime telemetry for debugging and performance inspection.
- **Backend File:** `backend/src/routes/metricRoutes.js`.
- **Endpoint:** `GET /api/metrics`.
- **Execution Path:** Captures `process.uptime()`, `process.memoryUsage()`, and `new Date()`.
- **Response Structure:**
  ```json
  {
    "uptime": 124.56,
    "memoryUsage": {
      "rss": 35426304,
      "heapTotal": 17825792,
      "heapUsed": 12543200,
      "external": 1845620,
      "arrayBuffers": 112450
    },
    "timestamp": "2026-10-08T12:00:00.000Z"
  }
  ```

### Feature 5: Multi-Container Local Development
- **Purpose:** Enables identical local replication of the 3-tier architecture with zero cloud dependencies.
- **Configuration File:** `docker-compose.yml`.
- **Orchestration:** Starts `postgres-db`, mounts `schema.sql` into `/docker-entrypoint-initdb.d/`, polls `pg_isready`, boots `backend` on port 3000 once DB is healthy, and boots `frontend` on port 5000 once backend starts.

### Feature 6: Modular Infrastructure as Code
- **Purpose:** Automates creation, modification, and destruction of all AWS resources in a repeatable manner.
- **Configuration File:** `terraform/main.tf` and `terraform/modules/*`.
- **Capabilities:** VPC creation, multi-AZ subnet allocation, security group chaining, RDS creation, Secrets Manager secret generation, ECR repository management, CloudWatch logging, and decoupled ECS Fargate compute management.

### Feature 7: Automated Keyless CI/CD Pipeline
- **Purpose:** Automatically builds, tests, pushes, and deploys code changes to AWS upon git pushes to the `master` branch.
- **Configuration File:** `.github/workflows/deploy.yml`.
- **Capabilities:** Runs Jest tests serially, assumes IAM roles via GitHub OIDC, builds Docker image, pushes to ECR with unique commit tags, renders task definitions, and executes zero-downtime rolling deployments on ECS Fargate.

---

## 8. Frontend Architecture

### 8.1 Framework and Tooling
- **Framework:** React 19 (`react: ^19.2.6`, `react-dom: ^19.2.6`)
- **Build Tool:** Vite 8 (`vite: ^8.0.12`, `@vitejs/plugin-react: ^6.0.1`)
- **Routing:** React Router DOM 7 (`react-router-dom: ^7.15.1`)
- **HTTP Client:** Axios (`axios: ^1.16.1`)

### 8.2 Application Entrypoint and Routing Tree
- **HTML Container:** `frontend/index.html` provides the mount point `<div id="root"></div>`.
  > *Observation:* `index.html` also contains a static tag `<h1>Hello there from AWS</h1>` immediately following `<div id="root"></div>`.
- **Entry Script:** `frontend/src/main.jsx`
  ```jsx
  import React from "react";
  import ReactDOM from "react-dom/client";
  import "./styles/global.css";
  import { BrowserRouter } from "react-router-dom";
  import App from "./App";

  ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  ```
- **Router Configuration:** `frontend/src/App.jsx`
  ```jsx
  import { Routes, Route } from "react-router-dom";
  import HomePage from "./pages/HomePage";

  function App() {
    return (
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes> 
    );
  }

  export default App;
  ```

### 8.3 Component Breakdown

#### `HomePage.jsx` (`frontend/src/pages/HomePage.jsx`)
- **Role:** Central container page managing items collection and API synchronization.
- **State Hooks:**
  - `const [items, setItems] = useState([])`: Array storing item objects `{ id, name }`.
  - `const [loading, setLoading] = useState(true)`: Boolean indicating initial data load.
  - `const [error, setError] = useState("")`: String holding error messages.
- **Lifecycle:** `useEffect(() => { fetchItems(); }, [])` calls API once on mount.
- **Handlers:**
  - `fetchItems`: Calls `getItems()`, updates `items`, or sets error `"Failed to fetch items"`. Always resets `loading` to `false` in `finally` block.
  - `handleAddItem`: Calls `createItem(item)`, appends returned item `setItems([...items, newItem])`, or sets error `"Failed to create item"`.
- **Conditional Rendering:**
  - If `loading === true`: renders `<p>Loading items...</p>`.
  - If `error !== ""`: renders `<p>{error}</p>`.
  - Else: renders `<h1>Items Dashboard</h1>`, `<ItemForm onAdd={handleAddItem} />`, and `<ItemList items={items} />`.

#### `ItemForm.jsx` (`frontend/src/components/ItemForm.jsx`)
- **Role:** Controlled form component for entering new item names.
- **State Hook:** `const [name, setName] = useState("")`.
- **Form Submission Logic:**
  ```javascript
  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;
    onAdd({ name: trimmedName });
    setName("");
  };
  ```
- **Inputs & Controls:** An `<input type="text" placeholder="Enter item" value={name} />` and a `<button type="submit">Add Item</button>`.

#### `ItemList.jsx` (`frontend/src/components/ItemList.jsx`)
- **Role:** Pure presentation component rendering item rows.
- **Props:** `{ items }` (array of objects).
- **Render Output:** Maps over items and outputs `<h3>{item.name}</h3>` keyed by `item.id`.

### 8.4 API Service Layer
- **Axios Factory:** `frontend/src/services/api.js`
  ```javascript
  import axios from "axios";

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  });

  export default api;
  ```
- **API Endpoints Module:** `frontend/src/api/itemsApi.js`
  - `getItems()`: Invokes `api.get("/api/items/getitems")` and returns `response.data.data`.
  - `createItem(item)`: Invokes `api.post("/api/items/createitems", item)` and returns `response.data.data`.

### 8.5 Styling and CSS Architecture
- **Global Styles:** `frontend/src/styles/global.css` (imported by `main.jsx`): Provides baseline font family, padding, and basic button/input padding.
- **Design Tokens:** `frontend/src/index.css`: Contains CSS custom properties (`--text`, `--text-h`, `--bg`, `--accent`, `--sans`, `--mono`), light/dark media queries, and container widths.
  > *Discrepancy Note:* `main.jsx` imports only `./styles/global.css`. As a result, the advanced design tokens and dark mode definitions in `index.css` are not currently imported or applied to the DOM tree unless explicitly referenced.

---

## 9. Backend Architecture

### 9.1 Server Entrypoint and Process Lifecycle
- **Entrypoint File:** `backend/server.js`
  ```javascript
  const app = require("./src/app");
  const { port } = require("./src/config/env");

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
  ```
- **Separation of Concerns:** `server.js` binds to network ports via `app.listen()`, while `src/app.js` configures routes and middleware without starting the listener. This architectural separation allows `supertest` to import `src/app.js` directly during tests without port binding conflicts.

### 9.2 Express Application Composition (`backend/src/app.js`)
The Express application is configured with the following middleware sequence:
```javascript
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const healthRoutes = require("./routes/healthRoutes");
const itemRoutes = require("./routes/itemRoutes");
const metricRoutes = require("./routes/metricRoutes");
const errorHandler = require("./middleware/errorHandler");
const { nodeEnv } = require("./config/env");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

if (nodeEnv !== "test") {
  app.use(morgan("dev"));
}

app.get("/", (req, res) => {
  res.json({ message: "Backend API running successfully" });
});

app.use("/health", healthRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/metrics", metricRoutes);

// Catch unknown routes and return 404 JSON
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorHandler);

module.exports = app;
```

### 9.3 Environment Configuration (`backend/src/config/env.js`)
Parses runtime parameters and sets defensive defaults:
```javascript
require("dotenv").config();

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 3000),
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: process.env.DB_SSL === "false" ? false : { rejectUnauthorized: false },
  },
};

module.exports = env;
```
> **SSL Configuration Behavior:** If `DB_SSL` is explicitly set to `"false"`, SSL is disabled (used in local Docker development). If `DB_SSL` is any other value (such as `"true"` in AWS ECS) or omitted, it defaults to `{ rejectUnauthorized: false }`, allowing encrypted connections to Amazon RDS instances without requiring bundled root CA certificates.

### 9.4 Database Connection Pool (`backend/src/db/index.js`)
```javascript
const { Pool } = require("pg");
const { db } = require("../config/env");

const pool = new Pool({
  host: db.host,
  port: db.port,
  user: db.user,
  password: db.password,
  database: db.database,
  ssl: db.ssl,
});

pool.on("connect", () => {
  console.log("Connected to the PostgreSQL database successfully");
});

pool.on("error", (err) => {
  console.error("Error connecting to the PostgreSQL database", err);
});

module.exports = pool;
```

### 9.5 Validation and Middleware
- **Validation Rules (`backend/src/validators/itemValidator.js`):**
  ```javascript
  const { body } = require("express-validator");

  const createItemValidation = [
    body("name")
      .exists({ checkFalsy: false })
      .withMessage("Name is required")
      .bail()
      .isString()
      .withMessage("Name must be a string")
      .trim()
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ min: 2, max: 100 })
      .withMessage("Name must be between 2 and 100 characters"),
  ];

  module.exports = { createItemValidation };
  ```
- **Validation Evaluator (`backend/src/middleware/validate.js`):**
  ```javascript
  const { validationResult } = require("express-validator");

  const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    next();
  };

  module.exports = validate;
  ```
- **Global Error Handler (`backend/src/middleware/errorHandler.js`):**
  ```javascript
  const errorHandler = (err, req, res, next) => {
    if (process.env.NODE_ENV !== "test") {
      console.error(err);
    }

    const statusCode = err.statusCode || err.status || 500;
    const message = statusCode >= 500
      ? "Internal Server Error"
      : (err.message || "Bad Request");

    res.status(statusCode).json({
      success: false,
      message,
    });
  };

  module.exports = errorHandler;
  ```

---

## 10. API Documentation

### Endpoint 1: Root Status Probe
- **Method:** `GET`
- **Path:** `/`
- **Purpose:** Verifies that the Express API is online.
- **Authentication:** None.
- **Request Parameters / Body:** None.
- **Success Response:**
  - Status: `200 OK`
  - Body:
    ```json
    {
      "message": "Backend API running successfully"
    }
    ```
- **cURL Example:**
  ```bash
  curl -X GET http://localhost:3000/
  ```

---

### Endpoint 2: Database Readiness and Health Probe
- **Method:** `GET`
- **Path:** `/health`
- **Purpose:** Health check endpoint used by ALB target groups and ECS container health checks. Evaluates both runtime responsiveness and database query execution.
- **Authentication:** None.
- **Database Query:** Executes `SELECT 1` through `pool.query()`.
- **Success Response:**
  - Status: `200 OK`
  - Body:
    ```json
    {
      "status": "OK",
      "uptime": 345.12,
      "timestamp": "2026-10-08T12:00:00.000Z"
    }
    ```
- **Error Response:**
  - Status: `503 Service Unavailable`
  - Condition: Database connection failure or query timeout.
  - Body:
    ```json
    {
      "status": "UNAVAILABLE",
      "message": "Database is unavailable"
    }
    ```
- **cURL Example:**
  ```bash
  curl -X GET http://localhost:3000/health
  ```

---

### Endpoint 3: Retrieve All Items
- **Method:** `GET`
- **Path:** `/api/items/getitems`
  > *Discrepancy Note:* The README mentions `GET /api/items`. The actual checked-in route is `/api/items/getitems`.
- **Purpose:** Retrieves all rows from the `items` table.
- **Authentication:** None.
- **Database Query:** Executes `SELECT * FROM items` through `pool.query()`.
- **Success Response:**
  - Status: `200 OK`
  - Body:
    ```json
    {
      "success": true,
      "count": 2,
      "data": [
        {
          "id": 1,
          "name": "Cloud Native Architecture"
        },
        {
          "id": 2,
          "name": "Terraform Deployment"
        }
      ]
    }
    ```
- **Error Response:**
  - Status: `500 Internal Server Error`
  - Body:
    ```json
    {
      "success": false,
      "message": "Internal Server Error"
    }
    ```
- **cURL Example:**
  ```bash
  curl -X GET http://localhost:3000/api/items/getitems
  ```

---

### Endpoint 4: Create New Item
- **Method:** `POST`
- **Path:** `/api/items/createitems`
  > *Discrepancy Note:* The README mentions `POST /api/items`. The actual checked-in route is `/api/items/createitems`.
- **Purpose:** Validates input and persists a new item to the database.
- **Authentication:** None.
- **Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "name": "Production Grade Deployment"
  }
  ```
- **Validation Rules:**
  - `name`: Must exist, must be of type string (`isString()`), must be non-empty after trimming, and length must be between 2 and 100 characters (`2 <= length <= 100`).
  - Rejects: Missing field, null, empty string, whitespace-only string, numeric values, and non-string types (boolean, array, object) with `400 Bad Request`.
  - Accepts: Boundary lengths 2 and 100 characters. Automatically trims leading/trailing whitespace.
- **Database Query:** Parameterized SQL:
  `INSERT INTO items (name) VALUES ($1) RETURNING *` with parameter `[name]`.
- **Success Response:**
  - Status: `201 Created`
  - Body:
    ```json
    {
      "success": true,
      "data": {
        "id": 3,
        "name": "Production Grade Deployment"
      }
    }
    ```
- **Validation Failure Response:**
  - Status: `400 Bad Request`
  - Body:
    ```json
    {
      "success": false,
      "errors": [
        {
          "type": "field",
          "value": "",
          "msg": "Name is required",
          "path": "name",
          "location": "body"
        },
        {
          "type": "field",
          "value": "",
          "msg": "Name must be between 2 and 100 characters",
          "path": "name",
          "location": "body"
        }
      ]
    }
    ```
- **Database Failure Response:**
  - Status: `500 Internal Server Error`
  - Body:
    ```json
    {
      "success": false,
      "message": "Internal Server Error"
    }
    ```
  - *Security Guarantee:* Internal SQL syntax, database connection strings, credentials, and stack traces are suppressed and never exposed in the response payload.
- **cURL Example:**
  ```bash
  curl -X POST http://localhost:3000/api/items/createitems \
    -H "Content-Type: application/json" \
    -d '{"name": "New Item"}'
  ```

---

### Endpoint 5: Process Metrics Snapshot
- **Method:** `GET`
- **Path:** `/api/metrics`
  > *Discrepancy Note:* The README mentions `GET /metrics`. The actual checked-in route is mounted under `/api/metrics`.
- **Purpose:** Exposes Node.js process runtime statistics.
- **Authentication:** None.
- **Success Response:**
  - Status: `200 OK`
  - Body:
    ```json
    {
      "uptime": 542.89,
      "memoryUsage": {
        "rss": 42565632,
        "heapTotal": 20455424,
        "heapUsed": 15234120,
        "external": 1945123,
        "arrayBuffers": 124320
      },
      "timestamp": "2026-10-08T12:00:00.000Z"
    }
    ```
- **cURL Example:**
  ```bash
  curl -X GET http://localhost:3000/api/metrics
  ```

---

### Endpoint 6: Unmatched Route Catch-All
- **Method:** Any (`GET`, `POST`, `PUT`, `DELETE`, etc.)
- **Path:** Any unmatched URL path
- **Purpose:** Standardizes 404 responses for undefined endpoints in JSON format rather than default HTML.
- **Authentication:** None.
- **Response:**
  - Status: `404 Not Found`
  - Body:
    ```json
    {
      "success": false,
      "message": "Route not found"
    }
    ```


---

## 11. Database Architecture

### 11.1 Relational Schema Definition
The database schema is defined in `backend/src/db/schema.sql`:
```sql
CREATE TABLE IF NOT EXISTS items (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);
```

### 11.2 Column Specifications and Data Lifecycle

| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | `BIGINT` | `GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY` | 64-bit auto-incrementing unique identifier managed by PostgreSQL identity sequence. |
| `name` | `VARCHAR(100)` | `NOT NULL` | String holding item title or name. Enforced 100-character upper bound. |

### 11.3 Database Initialization Workflows
1. **Local Docker Environment:**
   In `docker-compose.yml`, `schema.sql` is mounted to the PostgreSQL initialization directory:
   `- ./backend/src/db/schema.sql:/docker-entrypoint-initdb.d/01-schema.sql:ro`
   When the `postgres-db` container starts with a fresh named volume (`postgres_data`), PostgreSQL automatically executes this SQL script before accepting connections.
2. **AWS RDS Environment:**
   Terraform provisions the RDS PostgreSQL instance (`aws_db_instance.postgres`), but Terraform does not execute DDL scripts against RDS. The schema must be applied once after provisioning using `psql` from an authorized network location (e.g., a bastion host, VPN, or an EC2 instance in the VPC):
   ```bash
   psql -h <RDS_ENDPOINT> -U postgres -d cloudapp -f backend/src/db/schema.sql
   ```

### 11.4 Connection Management and Pooling
- **Client Library:** `pg` (`node-postgres`)
- **Pooling Object:** Shared `pg.Pool` instance initialized in `backend/src/db/index.js`.
- **Query Execution:** All database queries utilize parameterized inputs (`$1`), delegating query sanitization to the PostgreSQL binary protocol to prevent SQL injection vulnerabilities.
- **Connection Diagnostics:** Event listeners attached to the pool emit `"Connected to the PostgreSQL database successfully"` upon connection checkout and `"Error connecting to the PostgreSQL database"` on error.

### 11.5 AWS RDS Terraform Specifications (`terraform/modules/database/main.tf`)
- **Engine & Version:** PostgreSQL 15 (`engine = "postgres"`, `engine_version = "15"`)
- **Instance Class:** `db.t3.micro` (2 vCPUs, 1 GB RAM, burstable)
- **Storage:** 20 GB gp3 General Purpose SSD (`allocated_storage = 20`, `storage_type = "gp3"`)
- **Storage Encryption:** Enabled with AWS KMS (`storage_encrypted = true`)
- **Network Placement:** Subnet group `cloudapp-db-subnet-group` containing `db_a` and `db_b` subnets (`10.0.21.0/24` and `10.0.22.0/24`).
- **Public Accessibility:** Disabled (`publicly_accessible = false`)
- **High Availability:** Single-AZ (`multi_az = false`)
- **Backup Retention:** 7 days (`backup_retention_period = 7`)
- **Snapshot Policy:** Skip final snapshot enabled (`skip_final_snapshot = true`) for rapid tearing down of demo/dev environments.

---

## 12. Authentication and Authorization

### 12.1 Application-Level Authentication
- **Current Status:** Not Implemented.
- **Audit Findings:** There are no user registration routes, login routes, password hashing modules (bcrypt/argon2), session stores, or JWT verification middlewares in the codebase.
- **Route Access:** All endpoints (`/`, `/health`, `/api/metrics`, `/api/items/getitems`, `/api/items/createitems`) are accessible without authentication headers or tokens.

### 12.2 Infrastructure & Network-Level Perimeter Security
While application-level authentication is absent, access is constrained at the cloud infrastructure layer:
1. **Network Segmentation:** ECS Fargate tasks and RDS instances have no public IP addresses and reside within private VPC subnets.
2. **Security Group Chaining:** Direct access to PostgreSQL (port 5432) is restricted exclusively to network traffic originating from instances associated with `aws_security_group.ecs`.
3. **IAM Execution Authorization:** ECS Fargate uses IAM roles (`aws_iam_role.execution`) with least-privilege policies to retrieve database passwords from AWS Secrets Manager.
4. **CI/CD Authorization via OIDC:** GitHub Actions assumes an IAM role via OpenID Connect (OIDC) federation, eliminating static, long-lived AWS secret access keys.

---

## 13. AI / ML Architecture Analysis

### 13.1 Implementation Status
- **Current Status:** No AI/ML components are implemented in this repository.
- **Audit Verification:**
  - No Python, PyTorch, TensorFlow, Scikit-learn, ONNX, or ML dependencies exist.
  - No trained model files (`.pkl`, `.onnx`, `.pt`, `.h5`) exist in the repository.
  - No predictive inference pipelines, model evaluation scripts, or feature engineering routines are present.
- **Domain Clarification:** This repository is an Infrastructure as Code, DevOps, and cloud-native full-stack application reference implementation.

---

## 14. LLM / Generative AI Architecture Analysis

### 14.1 Implementation Status
- **Current Status:** No Large Language Models (LLMs) or Generative AI components are implemented.
- **Audit Verification:**
  - No OpenAI, Anthropic, Bedrock, LangChain, LlamaIndex, or Hugging Face client libraries are declared in `package.json`.
  - No prompt templates, system instructions, token management logic, or LLM response parsers are present.

---

## 15. RAG Architecture Analysis

### 15.1 Implementation Status
- **Current Status:** No Retrieval-Augmented Generation (RAG) architecture is implemented.
- **Audit Verification:**
  - No vector databases (Pinecone, Qdrant, Milvus, pgvector) are configured in code or Terraform.
  - No document loaders, text chunkers, or embedding models are present.

---

## 16. Agent / Agentic AI Architecture Analysis

### 16.1 Implementation Status
- **Current Status:** No autonomous AI agents or agent frameworks are implemented.
- **Audit Verification:**
  - No LangGraph, CrewAI, AutoGen, or tool-calling agent loops exist.
  - All application workflows are deterministic request-response HTTP cycles.

---

## 17. AI/ML Application Integration Analysis

### 17.1 Implementation Status
- **Current Status:** No AI/ML integration exists. The data pipeline is exclusively transactional CRUD operations against a relational PostgreSQL database.

---

## 18. Detailed Data Flows

### 18.1 Query Request Flow: Item Retrieval (`GET`)
```text
Browser Client
   │
   │ 1. GET /api/items/getitems
   ▼
Application Load Balancer (Port 80)
   │
   │ 2. Forward to target group (Port 3000)
   ▼
Express Web Server (ECS Fargate)
   ├── helmet() security headers
   ├── cors() origin check
   └── express.json()
   │
   │ 3. Dispatch to itemRoutes.js
   ▼
itemController.getItems()
   │
   │ 4. pool.query("SELECT * FROM items")
   ▼
PostgreSQL Database (Amazon RDS Port 5432)
   │
   │ 5. Return table rows [{ id: 1, name: "Item" }]
   ▼
itemController.getItems()
   │
   │ 6. JSON serialization: { success: true, count: n, data: rows }
   ▼
Application Load Balancer
   │
   │ 7. Return HTTP 200 OK
   ▼
Browser Client -> Axios -> React HomePage (setItems(data)) -> ItemList UI
```

### 18.2 Mutation Request Flow: Item Insertion (`POST`)
```text
Browser Client Form Submission
   │
   │ 1. POST /api/items/createitems
   │    Body: { "name": "Item Name" }
   ▼
Application Load Balancer (Port 80)
   │
   │ 2. Forward to target group (Port 3000)
   ▼
Express Web Server (ECS Fargate)
   ├── helmet() & cors()
   ├── express.json() parses req.body
   │
   │ 3. itemValidator.createItemValidation
   ├── body("name").trim().notEmpty().isLength({ min: 2, max: 100 })
   │
   │ 4. validate.js
   ├── validationResult(req)
   │   ├── If errors: Return HTTP 400 Bad Request { success: false, errors }
   │   └── If valid: Call next()
   ▼
itemController.createItems()
   │
   │ 5. pool.query("INSERT INTO items (name) VALUES ($1) RETURNING *", [name])
   ▼
PostgreSQL Database (Amazon RDS Port 5432)
   │
   │ 6. Insert row, evaluate identity sequence, return inserted record
   ▼
itemController.createItems()
   │
   │ 7. Return HTTP 201 Created { success: true, data: newRow }
   ▼
Application Load Balancer
   │
   │ 8. Forward HTTP 201 Created
   ▼
Browser Client -> Axios -> React HomePage (setItems([...items, newItem])) -> DOM Update
```

### 18.3 Secret Injection and Task Startup Flow
```text
ECS Fargate Task Scheduler
   │
   │ 1. Initiate task launch in private subnet
   ▼
AWS ECS Container Agent
   │
   │ 2. Assume IAM Role: cloudapp-ecs-execution
   ▼
AWS Secrets Manager
   │
   │ 3. Retrieve secret: cloudapp-db-secret
   │    Extract username and password keys
   ▼
Container Environment Injection
   ├── Set DB_USER = extracted username
   ├── Set DB_PASSWORD = extracted password
   ├── Set DB_HOST = aws_db_instance.postgres.address
   ├── Set DB_NAME = cloudapp
   └── Set DB_SSL = "true"
   │
   │ 4. Pull image from Amazon ECR (cloudapp-backend:<tag>)
   ▼
Container Execution (`npm start`)
   │
   │ 5. backend/server.js boots Express on port 3000
   │ 6. pg.Pool connects to RDS PostgreSQL with TLS enabled
   ▼
Internal Docker Health Check Passes -> ALB Target Group Health Check Passes
```

### 18.4 CI/CD Deployment Flow
```text
Developer Git Push to `master` branch
   │
   │ 1. Trigger GitHub Actions (.github/workflows/deploy.yml)
   ▼
GitHub Actions Runner (`ubuntu-latest`)
   ├── actions/checkout@v4
   ├── actions/setup-node@v4 (Node 20)
   ├── npm ci (backend dependencies)
   └── npm test (Jest tests runInBand)
   │
   │ 2. AWS OIDC Authentication
   ▼
aws-actions/configure-aws-credentials@v4
   │ Requests temporary STS token using secrets.AWS_ROLE_TO_ASSUME
   ▼
Amazon ECR Login (aws-actions/amazon-ecr-login@v2)
   │
   │ 3. Build & Tag Docker Image:
   │    Tag: ${github.sha}-${github.run_id}-${github.run_attempt}
   │ 4. Push Image to ECR
   ▼
Render Task Definition
   │ Download active task definition JSON via aws ecs describe-task-definition
   │ Strip metadata (.taskDefinitionArn, .revision, .status, etc.)
   │ Update container "backend" with new image tag
   ▼
Deploy to ECS Service (amazon-ecs-deploy-task-definition@v2)
   │ Register new task definition revision
   │ Update service cloudapp-backend
   │ Wait for service stability (zero-downtime rolling update)
```

---

## 19. Important Classes, Functions, and Modules

### 19.1 Backend Modules and Handlers

#### `backend/server.js`
- **Role:** HTTP server initialization and port binding.
- **Dependencies:** Imports `app` from `./src/app` and `port` from `./src/config/env`.
- **Function:** Calls `app.listen(port, callback)`.

#### `backend/src/app.js`
- **Role:** Express application factory.
- **Dependencies:** `express`, `cors`, `morgan`, `helmet`, route handlers, `errorHandler`.
- **Function:** Assembles middleware pipeline, mounts routes (`/health`, `/api/items`, `/api/metrics`), and exports the un-listened `app` instance.

#### `backend/src/config/env.js`
- **Role:** Centralized configuration provider.
- **Dependencies:** `dotenv`.
- **Exported Object:** `env` containing `nodeEnv`, `port`, and `db` credentials/TLS config.

#### `backend/src/db/index.js`
- **Role:** PostgreSQL connection pool provider.
- **Dependencies:** `pg.Pool`, `env.db`.
- **Exported Object:** Singleton `pool` instance.

#### `backend/src/controllers/itemController.js`
- **Functions:**
  - `getItems(req, res)`: Asynchronous handler executing `SELECT * FROM items`. Responds with status 200 or 500.
  - `createItems(req, res, next)`: Asynchronous handler extracting `req.body.name`, executing parameterized insert `INSERT INTO items (name) VALUES ($1) RETURNING *`, and responding with status 201 or forwarding errors via `next(error)`.

#### `backend/src/validators/itemValidator.js`
- **Exported Object:** `createItemValidation` array defining `express-validator` schema rules for the `name` field.

#### `backend/src/middleware/validate.js`
- **Function:** Middleware checking `validationResult(req)`. If errors exist, returns `400 { success: false, errors: [...] }`. Otherwise calls `next()`.

#### `backend/src/middleware/errorHandler.js`
- **Function:** Centralized 4-argument error handling middleware `(err, req, res, next)` returning `500 { success: false, message: "Internal Server Error" }`.

### 19.2 Frontend Components and Services

#### `frontend/src/services/api.js`
- **Role:** Axios client instance factory.
- **Configuration:** Instantiates Axios with `baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000"`.

#### `frontend/src/api/itemsApi.js`
- **Functions:**
  - `getItems()`: Asynchronous wrapper returning `(await api.get("/api/items/getitems")).data.data`.
  - `createItem(item)`: Asynchronous wrapper returning `(await api.post("/api/items/createitems", item)).data.data`.

#### `frontend/src/pages/HomePage.jsx`
- **Role:** Top-level view component managing items state, loading states, error states, and rendering sub-components.

#### `frontend/src/components/ItemForm.jsx`
- **Role:** Controlled form component capturing user input, executing client-side trimming, and invoking `onAdd`.

#### `frontend/src/components/ItemList.jsx`
- **Role:** Presentation component iterating over the items array and displaying item names.

---

## 20. Configuration Management

### 20.1 Configuration Layers
1. **Local Development Configuration:** Supplied via local `.env` files in `backend/` and `frontend/` or injected through environment blocks in `docker-compose.yml`.
2. **Container Build Configuration:** Passed at image build time via Docker `ARG` (`VITE_API_URL` in `frontend/Dockerfile`).
3. **AWS Cloud Configuration:**
   - Non-sensitive parameters passed as plain text container environment variables in the ECS task definition (`NODE_ENV`, `PORT`, `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_SSL`).
   - Sensitive credentials dynamically retrieved from AWS Secrets Manager via ARN references in the ECS task definition (`DB_USER`, `DB_PASSWORD`).
   - Infrastructure parameters declared in `terraform/variables.tf` and provided via `terraform.tfvars`.

---

## 21. Environment Variables Directory

| Variable Name | Environment / Layer | Required? | Default Value | Description / Purpose | Safe Example / Placeholder |
|---|---|---|---|---|---|
| `NODE_ENV` | Backend Runtime | No | `"development"` | Configures Node environment. Set to `"production"` in ECS and `"test"` during Jest runs. | `production` |
| `PORT` | Backend Runtime | No | `3000` | Port on which Express HTTP server listens. | `3000` |
| `DB_HOST` | Backend Runtime | Yes (in Cloud) | `undefined` | Hostname or IP of PostgreSQL database (RDS endpoint in cloud; `postgres-db` in Compose). | `cloudapp-postgres.xyz.ap-south-1.rds.amazonaws.com` |
| `DB_PORT` | Backend Runtime | No | `5432` | Port on which PostgreSQL listens. | `5432` |
| `DB_USER` | Backend Runtime | Yes | `undefined` | PostgreSQL username (injected from Secrets Manager in ECS). | `postgres` |
| `DB_PASSWORD` | Backend Runtime | Yes | `undefined` | PostgreSQL password (injected from Secrets Manager in ECS). | `<secret-db-password>` |
| `DB_NAME` | Backend Runtime | No | `undefined` | Name of the database to connect to. | `cloudapp` |
| `DB_SSL` | Backend Runtime | No | Defaults to enabled | Set to `"false"` to disable TLS. Set to `"true"` in ECS tasks. | `"true"` |
| `VITE_API_URL` | Frontend Build Arg | No | `http://localhost:3000`| Base URL configured on the Axios client for API calls. Should be set to ALB DNS in cloud. | `http://cloudapp-alb-123456.ap-south-1.elb.amazonaws.com` |
| `aws_region` | Terraform Variable | No | `"ap-south-1"` | AWS region where resources are provisioned. | `ap-south-1` |
| `project_name` | Terraform Variable | No | `"cloudapp"` | Name prefix used in tags and resource names. | `cloudapp` |
| `environment` | Terraform Variable | No | `"dev"` | Environment stage tag (`dev`, `staging`, `prod`). | `dev` |
| `db_password` | Terraform Variable | Yes (Sensitive)| — | Master password for Amazon RDS and Secrets Manager. | `<configured-externally>` |
| `db_username` | Terraform Variable | No | `"postgres"` | Master username for Amazon RDS and Secrets Manager. | `postgres` |
| `db_name` | Terraform Variable | No | `"cloudapp"` | Initial database name for Amazon RDS. | `cloudapp` |
| `backend_image`| Terraform Variable | No | `""` | Full ECR image URI and tag. If empty, ECS service creation is bypassed. | `123456789012.dkr.ecr.ap-south-1.amazonaws.com/cloudapp-backend:v1.0.0` |
| `AWS_ROLE_TO_ASSUME` | GitHub Actions Secret| Yes (CI/CD) | — | AWS IAM Role ARN trusted by GitHub OIDC for deployment. | `arn:aws:iam::123456789012:role/github-actions-ecs-deploy` |
| `AWS_REGION` | GitHub Actions Var | Yes (CI/CD) | — | Target AWS region in GitHub Actions workflow. | `ap-south-1` |
| `ECR_REPOSITORY`| GitHub Actions Var | Yes (CI/CD) | — | Amazon ECR repository name. | `cloudapp-backend` |
| `ECS_CLUSTER` | GitHub Actions Var | Yes (CI/CD) | — | Amazon ECS cluster name. | `cloudapp-dev` |
| `ECS_SERVICE` | GitHub Actions Var | Yes (CI/CD) | — | Amazon ECS service name. | `cloudapp-backend` |
| `ECS_TASK_DEFINITION`| GitHub Actions Var | Yes (CI/CD) | — | ECS task definition family name. | `cloudapp-backend` |

---

## 22. External Services and APIs

### 22.1 External Services Matrix

| Service Name | Category | Interaction Method | Authentication Mechanism | Role in Architecture | Failure Handling |
|---|---|---|---|---|---|
| **Amazon RDS PostgreSQL** | Managed Database | TCP / Port 5432 via `pg.Pool` | Master user credentials + TLS encryption | Primary relational data store | Handled by Express error handler; `/health` returns 503 |
| **AWS Secrets Manager** | Secret Store | ECS Task Definition `secrets` block | IAM Task Execution Role (`secretsmanager:GetSecretValue`) | Stores database credentials securely | Task fails to launch if secret cannot be retrieved |
| **Amazon ECS Fargate** | Serverless Compute | AWS API / ECS Container Agent | IAM Task & Execution Roles | Runs backend container tasks | Auto-replaces failed tasks |
| **Amazon ECR** | Container Registry| Docker CLI via AWS STS token | IAM role permissions (`ecr:GetAuthorizationToken`, etc.) | Stores immutable Docker images | Image pull failures halt deployment |
| **Application Load Balancer** | Load Balancer | HTTP Ingress / Health probes | Security Group perimeter | Routes external traffic to healthy ECS tasks | Returns 502/504 if target tasks are unresponsive |
| **Amazon CloudWatch** | Monitoring & Logs | AWS Logs driver (`awslogs`) | IAM Execution Role (`logs:CreateLogStream`, `logs:PutLogEvents`) | Aggregates container stdout/stderr logs | Logs buffered or task fails on permission error |
| **GitHub Actions & OIDC** | CI/CD | OpenID Connect federation | JWT token exchanged for AWS STS temporary credentials | Automates testing, building, and deploying | Halts pipeline on test or deployment failure |

---

## 23. Error Handling and Resilience

### 23.1 Validation Error Handling
When a user submits an invalid payload to `POST /api/items/createitems` (e.g., missing field, null, empty string, whitespace-only, numeric, boolean, array, object, <2 characters, or >100 characters):
1. `express-validator` registers schema errors via `.exists().bail().isString().trim().notEmpty().isLength({ min: 2, max: 100 })`.
2. `backend/src/middleware/validate.js` intercepts execution:
   ```javascript
   if (!errors.isEmpty()) {
     return res.status(400).json({ success: false, errors: errors.array() });
   }
   ```
3. A structured `400 Bad Request` response is returned immediately with error descriptors without executing database queries.
4. Malformed JSON payloads (e.g. invalid syntax) are intercepted by Express's JSON body-parser and normalized through the centralized error middleware into a `400 Bad Request` response.

### 23.2 Database Connection, Query Failures, and Route Catch-All
1. **Health Probe Failure:** In `healthRoutes.js`, if `pool.query("SELECT 1")` throws an error:
   ```javascript
   catch (error) {
     res.status(503).json({ status: "UNAVAILABLE", message: "Database is unavailable" });
   }
   ```
2. **Item Query Failure:** In `itemController.js`:
   - `getItems`: Catches error and calls `next(error)` to ensure centralized, secure error handling.
   - `createItems`: Catches error and calls `next(error)`.
3. **Global Sanitized Fallback:** `backend/src/middleware/errorHandler.js` catches unhandled exceptions passed to `next()`, maps status codes (defaulting to 500 for unhandled exceptions), and returns `{ success: false, message: statusCode >= 500 ? "Internal Server Error" : (err.message || "Bad Request") }`.
   - *Information Leak Prevention:* Prevents internal SQL syntax errors, database table names, RDS endpoints, or database user credentials from ever leaking to clients.
4. **Unknown Route Catch-All:** Unmatched route requests hit a catch-all middleware returning `404 Not Found` with `{ success: false, message: "Route not found" }`.

### 23.3 Frontend Error Handling and Resilience
- **Fetch Errors:** `App.jsx` catches failures during `getItems()` and updates `itemsError` state ("Failed to fetch items from database."). `ItemTable.jsx` renders an error banner with a "Retry Query" button that triggers `onRefresh`.
- **Create Errors:** `App.jsx` catches API creation rejections, extracts server-side error messages from `err.response.data`, and presents a prominent `AlertBanner` notification without unmounting the table interface.
- **Form-Level Validation:** `ItemFormModal.jsx` enforces client-side validation rules (rejects whitespace, enforces 2–100 characters, disables submit button when blank, displays spinner during submission) to prevent malformed API requests from ever being dispatched.

---

## 24. Security Posture and Hardening

### 24.1 Implemented Security Defenses
1. **HTTP Header Hardening:** `helmet()` is applied globally in `app.js`, injecting security headers including `X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`, and `X-XSS-Protection`.
2. **SQL Injection Mitigation:** Parameterized queries (`INSERT INTO items (name) VALUES ($1) RETURNING *`, `[name]`) ensure user inputs are never concatenated into raw SQL strings.
3. **Input Sanitization:** `express-validator` trims whitespace and enforces length boundaries (2–100 characters).
4. **Network Perimeter Isolation:**
   - ECS containers reside in private subnets with no public IPs.
   - RDS instances reside in isolated database subnets without internet gateways or NAT routes.
   - Security groups are strictly chained: ALB SG (`0.0.0.0/0` on 80/443) -> ECS SG (port 3000 restricted to ALB SG) -> RDS SG (port 5432 restricted to ECS SG).
5. **Secrets Security:** Database master passwords are stored in AWS Secrets Manager, encrypted via KMS, and injected into containers at launch time without appearing in Git commits.
6. **Keyless CI/CD:** GitHub Actions utilizes OpenID Connect (OIDC) to assume an IAM role dynamically, eliminating static, long-lived AWS secret access keys.
7. **Container Vulnerability Scanning:** Amazon ECR repository is configured with `scan_on_push = true` and `image_tag_mutability = "IMMUTABLE"`.

### 24.2 Visible Security Gaps and Considerations
- **No Application Authentication:** All API routes are public; anyone with access to the ALB URL can view and add items.
- **Unrestricted CORS:** `cors()` is instantiated without an explicit origin allowlist, permitting cross-origin requests from any origin.
- **ALB Plaintext HTTP:** The Application Load Balancer currently configures an HTTP listener on port 80. While the ALB security group allows port 443, no HTTPS listener or ACM SSL certificate is declared in Terraform.
- **Permissive SSL Mode:** In `backend/src/config/env.js`, database SSL defaults to `{ rejectUnauthorized: false }`, which encrypts traffic in transit but disables CA certificate chain verification.

---

## 25. CORS, Nginx, and Reverse Proxy Configuration

### 25.1 CORS Configuration
In `backend/src/app.js`:
```javascript
app.use(cors());
```
Default configuration allows `GET`, `HEAD`, `PUT`, `PATCH`, `POST`, and `DELETE` requests from any origin (`*`).

### 25.2 Frontend Nginx Reverse Proxy / Web Server (`frontend/nginx.conf`)
```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```
- **Port:** Listens on port 80 inside the container.
- **SPA Fallback:** `try_files $uri $uri/ /index.html;` ensures client-side routes handled by React Router (e.g., `/`) do not return 404 Not Found when refreshed directly in the browser.

### 25.3 Application Load Balancer Configuration (`terraform/modules/compute/main.tf`)
- **Type:** Internet-facing Application Load Balancer (`internal = false`, `load_balancer_type = "application"`).
- **Subnets:** Distributed across public subnets `public-a` and `public-b`.
- **Listener:** Port 80 HTTP forwarding to `aws_lb_target_group.backend`.
- **Target Group:** Target type `ip` (required for Fargate `awsvpc` network mode), protocol `HTTP`, port 3000.
- **Health Check Configuration:**
  - Path: `/health`
  - Matcher: `"200"`
  - Interval: `30` seconds
  - Timeout: `5` seconds
  - Healthy Threshold: `2`
  - Unhealthy Threshold: `3`

---

## 26. Docker and Containerization Strategy

### 26.1 Backend Container (`backend/Dockerfile`)
```dockerfile
# Base image
FROM node:20-alpine

# Create app directory inside container
WORKDIR /app

# Copy dependency files first for Docker layer caching
COPY package*.json ./

# Install dependencies deterministically
RUN npm ci

# Copy all project files
COPY . .

# Expose backend port
EXPOSE 3000

# Start server
CMD ["npm", "start"]
```
- **Base Image:** `node:20-alpine` (minimal footprint, reduced CVE surface).
- **Layer Caching:** Copies `package*.json` and executes `npm ci` before copying source code, ensuring dependency layers are cached across code edits.

### 26.2 Frontend Container (`frontend/Dockerfile`)
```dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
```
- **Multi-Stage Architecture:** Separates the Node compilation environment from the production web server.
- **Build Artifacts:** Compiles static assets with Vite, discards Node runtime, and copies compiled static assets into an Nginx Alpine container.
- **Build-Time Variable Injection:** Accepts `VITE_API_URL` as a build argument and bakes it into the static bundle during compilation.

### 26.3 Docker Compose Topology (`docker-compose.yml`)
- **`postgres-db`:**
  - Image: `postgres:18.4`
  - Port mapping: `5432:5432`
  - Volume: `postgres_data:/var/lib/postgresql`
  - Init script: `./backend/src/db/schema.sql:/docker-entrypoint-initdb.d/01-schema.sql:ro`
  - Health check: `pg_isready -U postgres -d cloudapp` every 10s.
- **`backend`:**
  - Builds `./backend`
  - Port mapping: `3000:3000`
  - Dependency: `depends_on.postgres-db.condition: service_healthy`
  - Environment: `DB_HOST: postgres-db`, `DB_SSL: "false"`
- **`frontend`:**
  - Builds `./frontend` with `VITE_API_URL: http://localhost:3000`
  - Port mapping: `5000:80`
  - Dependency: `depends_on: [backend]`

---

## 27. Build and Runtime Processes

### 27.1 Local Development Commands

#### Running the Full Stack with Docker Compose
```bash
# Build and launch all three tiers in the background
docker compose up --build -d

# View live container logs
docker compose logs -f

# Shut down stack and remove named database volumes
docker compose down -v
```

#### Running Backend Locally (Without Docker)
```bash
cd backend
npm install

npm run dev                 # Launches nodemon with hot-reload on http://localhost:3000
npm test                    # Runs isolated unit and API contract tests via Jest (mocked DB)
npm run test:unit           # Explicit alias for backend unit tests
npm run test:integration    # Runs real PostgreSQL integration tests against test database
npm run test:coverage       # Generates statement, branch, function, and line coverage report
npm run test:watch          # Runs unit tests in watch mode
```

#### Running Real PostgreSQL Integration Tests Locally
```bash
# 1. Start isolated test PostgreSQL service container
docker compose -f docker-compose.test.yml up -d

# 2. Run real database integration tests
npm run test:backend:integration

# 3. Stop test container
docker compose -f docker-compose.test.yml down -v
```

#### Running Frontend Locally (Without Docker)
```bash
cd frontend
npm install

npm run dev         # Launches Vite dev server on http://localhost:5173
npm run build       # Compiles production assets into dist/
npm run lint        # Runs ESLint code quality checks
npm test            # Runs automated component tests via Vitest & React Testing Library
npm run test:watch  # Runs frontend tests in interactive watch mode
```

#### Root Multi-Tier Test Commands
From the workspace root directory:
```bash
npm run test                    # Runs backend unit tests and frontend automated tests
npm run test:backend            # Runs backend unit and API tests
npm run test:backend:unit       # Explicit alias for backend unit tests
npm run test:backend:integration# Runs real PostgreSQL integration tests
npm run test:backend:coverage   # Runs backend tests with coverage report
npm run test:frontend           # Runs frontend Vitest component tests
npm run lint:frontend           # Runs frontend ESLint validation
npm run build:frontend          # Runs frontend production Vite build
npm run test:all                # Runs backend unit, integration, and frontend test suites
```

### 27.2 Terraform Cloud Provisioning Commands
```bash
cd terraform

# Initialize provider plugins
terraform init

# Validate configuration syntax
terraform validate

# Plan initial infrastructure (leave backend_image empty)
terraform plan -var="db_password=YourSecurePassword123"

# Apply core infrastructure (VPC, RDS, ALB, ECR, IAM)
terraform apply -var="db_password=YourSecurePassword123" -auto-approve

# Apply updated configuration once Docker image is pushed to ECR
terraform apply \
  -var="db_password=YourSecurePassword123" \
  -var="backend_image=<ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com/cloudapp-backend:v1.0.0"
```

---

## 28. Testing Suite and Quality Assurance

To align with production-quality software engineering and automated quality assurance standards, the repository implements a multi-tier testing strategy covering unit, API contract, database integration, frontend component, and CI/CD quality gates.

```
                    ┌─────────────────────────────────────────┐
                    │          CI/CD Quality Gates            │
                    │   (GitHub Actions + Docker + OIDC)      │
                    └────────────────────┬────────────────────┘
                                         │
        ┌────────────────────────────────┼────────────────────────────────┐
        ▼                                ▼                                ▼
┌──────────────────────┐      ┌──────────────────────┐      ┌──────────────────────┐
│  Backend Test Suite  │      │ Frontend Test Suite  │      │ Terraform Validation │
│  (Jest + Supertest)  │      │  (Vitest + RTL +     │      │ (fmt -check +        │
│                      │      │   JSDOM)             │      │  validate)           │
├──────────────────────┤      ├──────────────────────┤      ├──────────────────────┤
│ • 23 Mocked Unit/API │      │ • 21 Component Tests │      │ • HCL Formatting     │
│   tests              │      │ • Mocked Axios calls │      │ • Syntax Validation  │
│ • 8 Real PostgreSQL  │      │ • Form validation    │      │ • Provider Init      │
│   integration tests  │      │ • User-visible errors│      │                      │
└──────────────────────┘      └──────────────────────┘      └──────────────────────┘
```

### 28.1 Multi-Tier Test Architecture Overview

| Test Layer | Framework & Tools | Scope & Focus | Suite File(s) | Test Count | Pass Rate |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Backend Unit & API** | Jest, Supertest | HTTP contracts, operational telemetry, input validation, status codes, 404, bad JSON, safe 500 error masking | `tests/health.test.js`<br>`tests/items.test.js` | **23** | 100% (23/23) |
| **PostgreSQL Integration** | Jest, Supertest, `pg` | Dedicated test database safety check, `schema.sql` execution, BigInt identity IDs, NOT NULL & length constraints, SQL injection resilience | `tests/integration/items.integration.test.js`<br>`tests/integration/dbTestHelper.js` | **8** | 100% (8/8) |
| **Frontend Component & Workflow** | Vitest, React Testing Library, JSDOM | Component states (loading, empty, error with retry, success), modal form validation, whitespace trimming, search filtering, Axios mocks | `src/__tests__/ItemTable.test.jsx`<br>`src/__tests__/ItemFormModal.test.jsx`<br>`src/__tests__/ItemComponents.test.jsx`<br>`src/__tests__/App.test.jsx` | **21** | 100% (21/21) |
| **Total Automated Tests** | — | Comprehensive end-to-end regression safety net across all tiers | **7 Test Files** | **52** | **100% Passing** |

---

### 28.2 Backend Unit & API Contract Tests (`backend/tests/`)

Tests execute against Express `app.js` with isolated database query mocking (`jest.mock("../src/db")`), ensuring deterministic execution without requiring external service dependencies.

#### `backend/tests/health.test.js` (5 Tests)
- **`GET /health` (Healthy):** Mocks `pool.query.mockResolvedValue({ rows: [{ "1": 1 }] })`. Asserts status `200 OK`, confirms query `"SELECT 1"` was executed, and validates response schema containing `status: "OK"`, numeric `uptime`, and ISO string `timestamp`.
- **`GET /health` (Degraded):** Mocks `pool.query.mockRejectedValue(new Error("Connection refused"))`. Asserts status `503 Service Unavailable` with body `{ status: "UNAVAILABLE", message: "Database is unavailable" }`.
- **`GET /` (Root Endpoint):** Asserts status `200 OK` and `{ message: "Backend API running successfully" }`.
- **`GET /api/metrics`:** Asserts status `200 OK`, non-negative `uptime`, valid date `timestamp`, and memory usage telemetry containing `rss`, `heapTotal`, `heapUsed`, and `external` numeric properties.
- **Operational Error Handling:**
  - **404 Catch-All:** Issues request to `/api/non-existent-route`; asserts status `404 Not Found` with `{ success: false, message: "Route not found" }`.
  - **Malformed JSON:** Issues POST request with header `Content-Type: application/json` and malformed body `'{"name": "broken,'`; asserts status `400 Bad Request` with `{ success: false, message: expect.any(String) }`.

#### `backend/tests/items.test.js` (18 Tests)
- **`GET /api/items/getitems`:**
  - Empty database returns status `200 OK` and `{ success: true, count: 0, data: [] }`.
  - Populated database returns status `200 OK`, verifies SQL `"SELECT * FROM items"`, and validates count and record payloads.
  - Database failure returns status `500 Internal Server Error` with `{ success: false, message: "Internal Server Error" }`. Asserts that sensitive details (table names, credentials, stack traces) are not leaked to clients.
- **`POST /api/items/createitems`:**
  - Valid creation returns status `201 Created` with created record and verifies parameterized query `"INSERT INTO items (name) VALUES ($1) RETURNING *"`.
  - Automatically trims leading and trailing whitespace before database insertion (e.g. `"   Trimmable Item   "` -> `"Trimmable Item"`).
  - Accepts boundary minimum length of 2 characters (e.g. `"AB"`).
  - Accepts boundary maximum length of 100 characters (`"A".repeat(100)`).
  - Rejects missing `name` field with status `400 Bad Request` without executing database queries.
  - Rejects `null` name with status 400.
  - Rejects empty string name (`""`) with status 400.
  - Rejects whitespace-only name (`"     "`) with status 400.
  - Rejects numeric name (`12345`) with status 400.
  - Rejects non-string types (`true`, `false`, `["invalid"]`, `{ nested: "object" }`) with status 400.
  - Rejects names shorter than 2 characters (`"A"`) with status 400.
  - Rejects names longer than 100 characters (`"A".repeat(101)`) with status 400.
  - Handles unsupported `Content-Type: text/plain` requests gracefully with status 400.
  - Database insertion errors return status `500 Internal Server Error` with sanitized message `{ success: false, message: "Internal Server Error" }`, masking SQL strings and passwords.

---

### 28.3 Real PostgreSQL Integration Test Suite (`backend/tests/integration/`)

The integration test suite connects to a dedicated PostgreSQL database and executes `backend/src/db/schema.sql` to verify database behaviors that mocked tests cannot detect.

#### Safety Guard & Test Harness (`dbTestHelper.js`)
- **Strict Database Safety Check:** Evaluates target database name before running any query. If `db.database` does not contain `"test"` (e.g. if accidentally pointed at `cloudapp` or a production instance), it immediately aborts with `SAFETY VIOLATION: Refusing to run integration tests against database ...`.
- **Schema Bootstrap:** Reads and executes `backend/src/db/schema.sql` directly against PostgreSQL via `testPool.query()`.
- **Deterministic Cleanup:** Truncates items table and resets identity sequences (`TRUNCATE TABLE items RESTART IDENTITY CASCADE`) before each test and after test execution.
- **Connection Management:** Closes pool connections (`testPool.end()`) cleanly upon completion.

#### `backend/tests/integration/items.integration.test.js` (8 Tests)
1. **Safety Guard Verification:** Asserts that `validateTestDatabaseName("production_db")` and `validateTestDatabaseName("cloudapp")` throw safety violations, while `validateTestDatabaseName("cloudapp_test")` passes.
2. **Schema & Table Verification:** Queries `information_schema.columns` to verify `items` table exists with `id` (bigint identity primary key) and `name` (character varying 100, `is_nullable: NO`).
3. **Data Persistence & Incremental Identity:** Inserts multiple records; asserts that real auto-incrementing BigInt IDs are generated (`item2.id > item1.id`) and verifies records persist via `SELECT * FROM items`.
4. **NOT NULL Constraint Enforcement:** Verifies that attempting to insert `NULL` directly into PostgreSQL throws a real database constraint violation (`null value in column "name"`).
5. **VARCHAR(100) Length Constraint Enforcement:** Verifies that attempting to insert a 101-character string into PostgreSQL throws a database string truncation error (`value too long for type character varying(100)`).
6. **Parameterized Query & SQL Injection Resilience:** Inserts an SQL injection payload (`Robert'); DROP TABLE items;--`) and special characters (`'`, `"`, `&`, `<HTML>`). Asserts that the table is NOT dropped, the query executes safely via parameter binding, and the literal payload is preserved in the database.
7. **Empty Table API Verification:** Queries `GET /api/items/getitems` against an empty database through Supertest; asserts `200 OK`, `count: 0`, and `data: []`.
8. **End-to-End HTTP Integration:** Dispatches `POST /api/items/createitems` with an item payload; asserts `201 Created` with generated database ID; verifies subsequent `GET /api/items/getitems` returns the newly persisted item from PostgreSQL.

#### Local Execution with Docker Compose
```bash
# 1. Start isolated test PostgreSQL service container on port 5432
docker compose -f docker-compose.test.yml up -d

# 2. Run real database integration tests
npm run test:backend:integration

# 3. Stop test container
docker compose -f docker-compose.test.yml down -v
```

---

### 28.4 Frontend Automated Component Tests (`frontend/src/__tests__/`)

The frontend testing suite is built using **Vitest**, **React Testing Library**, and **JSDOM** (`frontend/vite.config.js`), simulating real user interactions and DOM updates with mocked API services.

#### `src/__tests__/ItemTable.test.jsx` (7 Tests)
- **Loading State:** Asserts that the spinner and message `"Loading items from PostgreSQL..."` are rendered when `loading === true`.
- **Error State with Retry:** Asserts error message is rendered and clicking `"Retry Query"` triggers the `onRefresh` callback.
- **Empty State:** Asserts `"No items in database"` is rendered and clicking `"Create Item"` triggers `onOpenCreate`.
- **Populated Records Table:** Asserts table renders item names, `#id` badges, `"PostgreSQL 16"` storage pills, `"Active"` status indicators, and footer summary (`"Showing 3 of 3 items"`).
- **Search Filtering:** Simulates user typing into search input; verifies that matching rows remain visible while non-matching rows are excluded; verifies clearing search restores all rows.
- **No Matching Records State:** Asserts that searching for a non-existent item displays `"No matching items found"` and clicking `"Clear Search"` resets the table.
- **Refresh Action:** Asserts clicking the toolbar refresh button calls `onRefresh`.

#### `src/__tests__/ItemFormModal.test.jsx` (6 Tests)
- **Modal Visibility:** Asserts component returns `null` when `isOpen === false`; renders `"Create New Item"` header, inputs, and actions when `isOpen === true`.
- **Minimum Length Validation:** Typing a 1-character name and submitting displays validation error `"Item name must be at least 2 characters."` and halts submission.
- **Whitespace Trimming:** Typing `"   Clean Item Name   "` and submitting invokes `onSubmit({ name: "Clean Item Name" })` with whitespace trimmed.
- **Modal Close Handlers:** Verifies that clicking Cancel, clicking the close icon button, and pressing the `Escape` key all trigger `onClose()`.
- **Submission State:** When `submitting === true`, verifies that inputs and buttons are disabled and the `"Creating..."` spinner is displayed.

#### `src/__tests__/ItemComponents.test.jsx` (4 Tests)
- **ItemForm:** Verifies input and `"Add Item"` button render; verifies empty or whitespace-only submissions are ignored; verifies submitting valid input calls `onAdd` with trimmed name and clears the input field.
- **ItemList:** Verifies array of items is rendered in the DOM.

#### `src/__tests__/App.test.jsx` (4 Tests)
- **Initial Telemetry & Item Fetch:** Mocks `api.get("/api/items/getitems")` and `api.get("/health")`; renders `<App />` within `<MemoryRouter initialEntries={["/items"]}>`; verifies items and health data are fetched and rendered.
- **API Failure State:** Mocks `api.get("/api/items/getitems")` failure; asserts `"Failed to fetch items from database."` error message is displayed.
- **Item Creation Workflow:** Simulates opening modal, typing `"New Lambda Function"`, and submitting; mocks `api.post("/api/items/createitems")`; verifies success banner (`"created successfully in PostgreSQL"`) appears and the new item is appended to the table.
- **Failed Creation Alert:** Mocks `api.post("/api/items/createitems")` rejection with a server error; asserts that a user-visible `AlertBanner` appears with the server error message.

---

### 28.5 Test Verification Results & Code Coverage

#### Verification Results Across All Suites
All 52 automated tests were executed and passed cleanly:

```text
Backend Unit & API:       2 passed suites, 23 passed tests (0 failed)
PostgreSQL Integration:   1 passed suite,   8 passed tests (0 failed)
Frontend Component:       4 passed suites, 21 passed tests (0 failed)
Frontend ESLint:          Passed (0 errors)
Frontend Production Build:Built in 716ms (0 errors)
Total Automated Tests:    7 test files,   52 passed tests (100% pass rate)
```

#### Backend Coverage Report (`npm run test:coverage`)
```text
--------------------|---------|----------|---------|---------|-------------------
File                | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
--------------------|---------|----------|---------|---------|-------------------
All files           |   97.46 |    73.91 |     100 |   97.46 |                   
 src                |   95.83 |       50 |     100 |   95.83 |                   
  app.js            |   95.83 |       50 |     100 |   95.83 | 18 (morgan dev)   
 src/config         |     100 |       75 |     100 |     100 |                   
  env.js            |     100 |       75 |     100 |     100 | 4, 12             
 src/controllers    |     100 |       50 |     100 |     100 |                   
  itemController.js |     100 |       50 |     100 |     100 | 19                
 src/middleware     |   92.85 |    81.81 |     100 |   92.85 |                   
  errorHandler.js   |   85.71 |    77.77 |     100 |   85.71 | 3                 
  validate.js       |     100 |      100 |     100 |     100 |                   
 src/routes         |     100 |      100 |     100 |     100 |                   
  healthRoutes.js   |     100 |      100 |     100 |     100 |                   
  itemRoutes.js     |     100 |      100 |     100 |     100 |                   
  metricRoutes.js   |     100 |      100 |     100 |     100 |                   
 src/validators     |     100 |      100 |     100 |     100 |                   
  itemValidator.js  |     100 |      100 |     100 |     100 |                   
--------------------|---------|----------|---------|---------|-------------------
```

---

### 28.6 CI/CD Quality Gates in GitHub Actions (`deploy.yml`)

The delivery pipeline in `.github/workflows/deploy.yml` enforces automated quality gates before any deployment task can run:

```yaml
jobs:
  backend-tests:
    name: Backend Unit & Integration Tests
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: root
          POSTGRES_DB: cloudapp_test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: backend/package-lock.json
      - run: npm ci
        working-directory: backend
      - run: npm test
        working-directory: backend
      - run: npm run test:integration
        working-directory: backend
        env:
          NODE_ENV: test
          TEST_DB_HOST: localhost
          TEST_DB_PORT: 5432
          TEST_DB_USER: postgres
          TEST_DB_PASSWORD: root
          TEST_DB_NAME: cloudapp_test
          TEST_DB_SSL: "false"

  frontend-checks:
    name: Frontend Lint, Tests & Production Build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: frontend/package-lock.json
      - run: npm ci
        working-directory: frontend
      - run: npm run lint
        working-directory: frontend
      - run: npm test
        working-directory: frontend
      - run: npm run build
        working-directory: frontend

  terraform-checks:
    name: Terraform Format & Validation
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: hashicorp/setup-terraform@v3
        with:
          terraform_version: "1.7.0"
      - run: terraform fmt -check
        working-directory: terraform
      - run: terraform init -backend=false
        working-directory: terraform
      - run: terraform validate
        working-directory: terraform

  deploy:
    name: Deploy Backend to ECS
    runs-on: ubuntu-latest
    needs: [backend-tests, frontend-checks, terraform-checks]
    if: github.event_name == 'push' && github.ref == 'refs/heads/master'
    steps:
      # OIDC AWS auth, ECR build & push, ECS task definition render, and deploy
```

**Quality Gate Enforcement Guarantees:**
1. **Parallel Verification:** `backend-tests`, `frontend-checks`, and `terraform-checks` run concurrently on isolated runners.
2. **Hard Deployment Gate:** The `deploy` job explicitly requires `needs: [backend-tests, frontend-checks, terraform-checks]`. If any unit test, integration test, frontend test, ESLint rule, production bundle compilation, or Terraform validation check fails, deployment is immediately aborted.
3. **No Credential Exposure:** AWS OIDC authentication and STS token exchange are restricted solely to the `deploy` job. No AWS credentials or database secrets are accessed or exposed during testing.

---

## 29. Performance and Optimization Mechanisms

### 29.1 Connection Reuse
- **Connection Pooling:** Rather than establishing a new TCP connection on every incoming HTTP request, `backend/src/db/index.js` manages a persistent connection pool via `pg.Pool`. Connections are reused across requests, minimizing TLS negotiation and database authentication overhead.

### 29.2 Build and Deployment Optimizations
- **Multi-Stage Docker Builds:** The frontend build utilizes a multi-stage process where build dependencies (`node:20-alpine`, Vite, compilers) are discarded, resulting in a lightweight final image containing only static assets served by `nginx:alpine`.
- **Docker Layer Caching:** Both Dockerfiles copy `package*.json` and execute `npm ci` prior to copying application source files, avoiding redundant dependency downloads during code changes.
- **Serverless Fargate Scaling:** ECS tasks are allocated 256 CPU units (0.25 vCPU) and 512 MB memory, matching the workload requirements while keeping resource utilization lean.
- **ALB IP-Target Routing:** The ECS target group uses `target_type = "ip"`, enabling the ALB to route traffic directly to the private ENI IP address of the Fargate task without requiring EC2 bridge networking.

---

## 30. Important Design Decisions

### Decision 1: Decoupled Compute Provisioning in Terraform
- **Implementation:** In `terraform/modules/compute/main.tf`:
  ```hcl
  locals {
    ecs_enabled = var.backend_image != ""
  }
  resource "aws_ecs_task_definition" "backend" {
    count = local.ecs_enabled ? 1 : 0
    ...
  }
  ```
- **Rationale:** Resolves the circular dependency problem between infrastructure provisioning and container deployment. On the initial Terraform run, the ECR repository exists but holds no Docker image. Setting `backend_image = ""` allows Terraform to provision the VPC, RDS, ALB, and ECR without failing on a missing container image. Once the image is built and pushed to ECR, updating `backend_image` provisions the ECS task definition and service.

### Decision 2: Drift-Safe ECS Task Definition Lifecycle
- **Implementation:** In `aws_ecs_service.backend`:
  ```hcl
  lifecycle {
    ignore_changes = [task_definition]
  }
  ```
- **Rationale:** Prevents Terraform from rolling back container image revisions deployed by GitHub Actions. When GitHub Actions deploys a new commit tag, it updates the task definition ARN on the ECS service. Without `ignore_changes`, any subsequent `terraform apply` would revert the service back to the older image specified in Terraform state.

### Decision 3: Keyless AWS OIDC Authentication in CI/CD
- **Implementation:** In `.github/workflows/deploy.yml`:
  ```yaml
  permissions:
    id-token: write
    contents: read
  ...
  - name: Configure AWS credentials with OIDC
    uses: aws-actions/configure-aws-credentials@v4
    with:
      role-to-assume: ${{ secrets.AWS_ROLE_TO_ASSUME }}
      aws-region: ${{ env.AWS_REGION }}
  ```
- **Rationale:** Eliminates static IAM user access keys (`AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`) from GitHub Secrets. Access is authenticated dynamically via short-lived AWS STS tokens issued through an OIDC trust relationship configured between AWS IAM and GitHub Actions.

---

## 31. Technical Trade-offs

| Trade-Off Area | Choice Made | Alternatives Considered | Rationale & Architectural Trade-Off |
|---|---|---|---|
| **Container Compute** | AWS ECS Fargate | AWS EKS (Kubernetes) or EC2 instances | Fargate provides a serverless execution model with zero EC2 host management overhead. Trade-off: slightly higher cost per vCPU than reserved EC2, but drastically lower operational maintenance. |
| **Database Management**| Amazon RDS PostgreSQL | Amazon Aurora or self-hosted DB on EC2 | RDS PostgreSQL provides automated backups, patching, and KMS encryption out of the box. Trade-off: less auto-scaling storage flexibility than Aurora, but more cost-effective for single-node development workloads. |
| **SQL Access Layer** | Plain SQL with `pg.Pool` | Prisma ORM, TypeORM, or Sequelize | Parameterized SQL gives complete control over queries with zero ORM abstraction overhead. Trade-off: schema migrations and data types must be managed manually without automated TypeScript model synchronization. |
| **Network Egress** | Single NAT Gateway in Public A | Multi-AZ NAT Gateways (one per AZ) | Using a single NAT Gateway in `public-a` provides outbound internet access for all private subnets while minimizing AWS hourly NAT Gateway costs. Trade-off: an outage in Availability Zone A would interrupt internet egress for tasks in Availability Zone B. |
| **Application Auth** | None (Network perimeter security) | JSON Web Tokens (JWT) or AWS Cognito | Omitted to keep the project focused on infrastructure, DevOps, and cloud containerization patterns. Trade-off: API endpoints cannot differentiate individual user identities. |

---

## 32. Current System Limitations

1. **Incomplete CRUD Operations:** The API supports listing (`GET`) and creation (`POST`), but does not implement single-item retrieval (`GET /api/items/:id`), updating (`PUT/PATCH`), or deletion (`DELETE`).
2. **Missing Database Migration Tooling:** There is no automated migration framework (e.g., Flyway, Knex, Liquibase). Database schema bootstrap relies on executing `schema.sql` manually on RDS or through Docker Compose volume initialization.
3. **Single Availability Zone Database:** RDS PostgreSQL is configured with `multi_az = false`. A database hardware failure would require instance reboot or restoration from backup rather than automatic standby failover.
4. **Single NAT Gateway Resilience:** Both private subnets route outbound traffic through a single NAT Gateway in `public-a`, introducing a single point of failure for outbound internet traffic if Availability Zone A fails.
5. **No HTTPS Listener on ALB:** The Application Load Balancer currently listens only on HTTP port 80. Port 443 ingress is allowed in the security group, but no TLS certificate or HTTPS listener is configured in Terraform.
6. **Frontend State & Error Recovery Enhancements:** While the core dashboard in `App.jsx` and `ItemTable.jsx` features defensive state handling with non-destructive alert banners, empty states, loading indicators, and retry queries (`onRefresh`), the legacy route component in `HomePage.jsx` still demonstrates a rudimentary fallback pattern that replaces the entire UI with `<p>{error}</p>` on query failure.
7. **Local PostgreSQL Integration Testing Prerequisite:** Running the database integration suite (`npm run test:integration`) locally requires a live PostgreSQL instance (e.g., launched via `docker-compose -f docker-compose.test.yml up -d`). If PostgreSQL is not running locally, the suite verifies the database safety guard, logs an advisory warning, and exits cleanly. In GitHub Actions CI, an automated `postgres:16-alpine` service container provides an ephemeral test database running all 8 integration tests end-to-end.

---

## 33. Known Issues, Anomalies, and Codebase Observations

1. **Route Path Discrepancy between Documentation and Code:**
   - Documentation (`README.md`, `docs/deployment-steps.md`) references `GET /api/items`, `POST /api/items`, and `GET /metrics`.
   - The actual implementation in code is `GET /api/items/getitems`, `POST /api/items/createitems`, and `GET /api/metrics`.
   - The frontend Axios calls (`itemsApi.js`) match the actual implementation (`/getitems` and `/createitems`).
2. **Unimported Design System CSS:**
   - `frontend/src/index.css` contains custom properties, typography, and dark-mode styles.
   - `frontend/src/main.jsx` imports only `./styles/global.css`. As a result, the styling rules in `index.css` are not currently active in the DOM tree.
3. **Static Header in `index.html`:**
   - `frontend/index.html` contains a hardcoded `<h1>Hello there from AWS</h1>` tag below `<div id="root"></div>`. This static heading renders below the React application output.
4. **Local vs. Cloud PostgreSQL Version Difference:**
   - `docker-compose.yml` specifies `postgres:18.4`.
   - Terraform specifies PostgreSQL 15 (`engine_version = "15"`).
5. **Unused Random Provider in Terraform:**
   - `terraform/versions.tf` declares `hashicorp/random = "~> 3.6"`, but no random resources (`random_password`, `random_string`, etc.) are declared in the `.tf` files.

---

## 34. Important Constants and Business Rules

- **Networking:**
  - VPC CIDR Block: `10.0.0.0/16`
  - Public Subnets: `10.0.1.0/24` (AZ A), `10.0.2.0/24` (AZ B)
  - Private ECS Subnets: `10.0.11.0/24` (AZ A), `10.0.12.0/24` (AZ B)
  - Isolated Database Subnets: `10.0.21.0/24` (AZ A), `10.0.22.0/24` (AZ B)
- **Port Allocations:**
  - HTTP Public Port: `80`
  - HTTPS Public Port: `443`
  - Backend API Container Port: `3000`
  - PostgreSQL Database Port: `5432`
  - Frontend Container Host Port (Local): `5000`
- **Validation Rules:**
  - `name`: Must be trimmed, non-empty, and length must satisfy `2 <= length <= 100`.
- **ECS & Health Check Thresholds:**
  - Fargate CPU: `256` units (0.25 vCPU)
  - Fargate Memory: `512` MB
  - ALB Health Check Path: `/health`
  - ALB Health Check Interval: `30` seconds
  - ALB Health Check Timeout: `5` seconds
  - ALB Healthy Threshold: `2` consecutive successes
  - ALB Unhealthy Threshold: `3` consecutive failures
  - ECS Service Health Check Grace Period: `120` seconds
  - CloudWatch Log Retention: `14` days

---

## 35. Complete Module Dependency Map

```text
                                [ Internet User ]
                                        │
                                        ▼
                           [ frontend/src/main.jsx ]
                                        │
                                        ▼
                            [ frontend/src/App.jsx ]
                                        │
                                        ▼
                         [ frontend/src/pages/HomePage ]
                           │                        │
                           ▼                        ▼
               [ components/ItemForm ]    [ components/ItemList ]
                           │
                           ▼
                  [ api/itemsApi.js ]
                           │
                           ▼
                 [ services/api.js ] (Axios instance with VITE_API_URL)
                           │
                           ▼
             [ AWS ALB: cloudapp-alb (Port 80) ]
                           │
                           ▼
        [ ECS Target Group: cloudapp-backend (Port 3000) ]
                           │
                           ▼
                   [ backend/server.js ]
                           │
                           ▼
                    [ backend/src/app.js ]
          ┌────────────────┼────────────────┬────────────────┐
          ▼                ▼                ▼                ▼
     helmet/cors      morgan dev     healthRoutes.js  metricRoutes.js
          │                │                │                │
          ▼                ▼                ▼                ▼
    itemRoutes.js   express.json()    pool (SELECT 1)  process.memory
          │
          ├──> validators/itemValidator.js (express-validator)
          ├──> middleware/validate.js
          └──> controllers/itemController.js
                     │
                     ▼
             [ backend/src/db/index.js ] (pg.Pool)
                     │
                     ▼
     [ Amazon RDS PostgreSQL 15 Instance (Port 5432) ]
```

---

## 36. Important Runtime Sequences

### 36.1 End-to-End Item Creation Sequence
```text
User            ItemForm       HomePage       itemsApi        ALB         Express         Validator     Controller      pg.Pool         RDS
 │                 │              │              │             │             │                │             │            │           │
 ├─ Types name ───►│              │              │             │             │                │             │            │           │
 ├─ Submits ──────►│              │              │             │             │                │             │            │           │
 │                 ├─ onAdd() ───►│              │             │             │                │             │            │           │
 │                 │              ├─createItem()►│             │             │                │             │            │           │
 │                 │              │              ├─POST /items►│             │                │             │            │           │
 │                 │              │              │             ├─Forward────►│                │             │            │           │
 │                 │              │              │             │             ├─Run checks────►│             │            │           │
 │                 │              │              │             │             │◄──Next()───────┤             │            │           │
 │                 │              │              │             │             ├─createItems()────────────────►│            │           │
 │                 │              │              │             │             │                │             ├─query()───►│           │
 │                 │              │              │             │             │                │             │            ├──INSERT──►│
 │                 │              │              │             │             │                │             │            │◄──Row─────┤
 │                 │              │              │             │             │                │             │◄─Result────┤           │
 │                 │              │              │             │             │◄──201 JSON───────────────────┤            │           │
 │                 │              │              │             │◄──201───────┤                │             │            │           │
 │                 │              │              │◄──Data──────┤             │                │             │            │           │
 │                 │              │◄──newItem────┤             │             │                │             │            │           │
 │                 │              ├─setItems()   │             │             │                │             │            │           │
 │◄─UI Re-renders──┴──────────────┴──────────────┴─────────────┴─────────────┴────────────────┴─────────────┴────────────┴───────────┤
```

---

## 37. Interview Perspective and Technical Defense

### 37.1 Pitch Formats

#### 30-Second Elevator Pitch
> "I built a cloud-native 3-tier web application using React, Express, and PostgreSQL, deployed to AWS with modular Terraform. The backend runs as serverless containers on ECS Fargate behind an Application Load Balancer across multi-AZ private subnets, with an encrypted RDS PostgreSQL database in isolated tiers. The CI/CD pipeline in GitHub Actions uses AWS OIDC for keyless authentication to run tests, build Docker images, push to ECR, and execute rolling zero-downtime updates."

#### 1-Minute Overview
> "This project demonstrates an enterprise-style cloud migration and automated delivery workflow. The application tier uses Express 5 with Helmet, express-validator, and connection pooling against PostgreSQL. The infrastructure is codified in Terraform across a 3-tier VPC with public ingress, private Fargate compute, and isolated RDS database subnets. Security group chaining ensures database access is restricted exclusively to application containers. Credential hygiene is maintained by storing database secrets in AWS Secrets Manager and injecting them dynamically at runtime. For CI/CD, GitHub Actions leverages OpenID Connect to securely assume IAM roles without static keys, running integration tests, building container images, and deploying to ECS with automated stability checks."

#### 2-Minute Technical Deep Dive
> "From an architecture perspective, the core focus of this project was enforcing strict defense-in-depth and operational reliability across the AWS ecosystem. 
> 
> On the networking tier, I implemented a VPC spanning two Availability Zones in `ap-south-1` partitioned into 6 subnets across public, private, and database tiers. The database subnets have no internet gateway routes, and the private application subnets reach the internet strictly through a NAT Gateway for image pulls and telemetry. Security groups are strictly chained: the ALB accepts port 80/443, the ECS security group accepts port 3000 solely from the ALB, and the RDS security group accepts port 5432 solely from the ECS security group.
> 
> On the compute layer, I deployed the backend to AWS ECS Fargate, abstracting away server maintenance while maintaining fine-grained control via IAM task and execution roles. Secrets Manager manages database credentials, decoupling sensitive information from source code. In Terraform, I decoupled compute provisioning from infrastructure provisioning using a dynamic local flag (`local.ecs_enabled = var.backend_image != ""`), allowing the initial environment to provision cleanly before any container image exists. Furthermore, I applied `lifecycle { ignore_changes = [task_definition] }` on the ECS service so that CI/CD deployments via GitHub Actions don't conflict with Terraform state.
> 
> Finally, the delivery pipeline uses GitHub Actions with AWS OIDC, exchanging GitHub's token for temporary STS credentials. It runs Jest integration tests, builds a multi-stage Docker image, pushes to ECR, and executes an automated zero-downtime rolling update on ECS."

### 37.2 Realistic Technical Interview Questions & Answers

#### Q1: "Why did you use AWS ECS Fargate instead of deploying on Amazon EC2 or Amazon EKS?"
- **Answer Focus:** Fargate eliminates the operational overhead of patching, scaling, and managing EC2 virtual machine instances and AMIs. Compared to EKS, Fargate on ECS provides container orchestration without the control-plane cost and management complexity of Kubernetes, making it well-suited for microservices and 3-tier architectures that need reliability without operational bloat.

#### Q2: "How did you avoid chicken-and-egg dependencies between Terraform and your Docker images?"
- **Answer Focus:** Explain `local.ecs_enabled = var.backend_image != ""` in `terraform/modules/compute/main.tf`. When applying Terraform for the first time, `backend_image` is left empty. Terraform provisions the VPC, RDS, ALB, and ECR repository without attempting to launch ECS tasks against a non-existent image. Once the initial image is built and pushed to ECR, `backend_image` is supplied to Terraform (or updated via GitHub Actions) to provision the ECS task definition and service.

#### Q3: "How do you prevent Terraform from rolling back container versions when your CI/CD pipeline deploys new code?"
- **Answer Focus:** Explain `lifecycle { ignore_changes = [task_definition] }` inside `aws_ecs_service.backend`. GitHub Actions updates the ECS service task definition with every push to `master`. Without `ignore_changes`, any subsequent `terraform apply` would detect task definition drift and revert the service back to the older image declared in Terraform code.

#### Q4: "Why did you choose AWS OIDC over storing AWS Access Keys in GitHub Secrets?"
- **Answer Focus:** Static IAM access keys pose a significant security risk if leaked and require manual key rotation policies. OpenID Connect (OIDC) establishes a cryptographic trust federation between GitHub and AWS IAM. The workflow requests a short-lived JSON Web Token, which AWS Security Token Service (STS) validates and exchanges for temporary credentials with limited session duration, adhering to AWS least-privilege security standards.

#### Q5: "What happens if the PostgreSQL database crashes or becomes unreachable in production?"
- **Answer Focus:** Point to `healthRoutes.js`. The `/health` endpoint executes `SELECT 1` against the database pool. If the query throws an error, it responds with `503 Service Unavailable`. The ALB target group evaluates `/health` every 30 seconds; upon receiving 3 consecutive failed health probes, the ALB stops routing traffic to the failing container. Simultaneously, ECS task health checks fail, prompting the ECS service to automatically terminate and replace the failing task.

---

## 38. Project Knowledge Checklist for AI Systems

An AI system reasoning about this repository should be capable of answering the following questions:

- [x] **Core Functionality:** What does the application do? *(Lists and creates items in PostgreSQL through an Express REST API and a React frontend).*
- [x] **Network Topology:** What is the VPC layout? *(CIDR `10.0.0.0/16`, 2 public subnets, 2 private subnets, 2 database subnets across 2 AZs).*
- [x] **Data Persistence:** What tables exist in PostgreSQL? *(A single table `items` with columns `id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY` and `name VARCHAR(100) NOT NULL`).*
- [x] **Routing Discrepancies:** What are the actual backend route paths? *(`GET /`, `GET /health`, `GET /api/metrics`, `GET /api/items/getitems`, `POST /api/items/createitems`).*
- [x] **Security Chaining:** How are security groups tiered? *(ALB SG accepts 80/443; ECS SG accepts 3000 only from ALB SG; RDS SG accepts 5432 only from ECS SG).*
- [x] **Authentication:** Is there user login or JWT authentication? *(No, the application has no user authentication; access is constrained via AWS networking and IAM).*
- [x] **AI / ML Status:** Does the project use ML, LLMs, or RAG? *(No, it is purely a full-stack, DevOps, and cloud infrastructure application).*
- [x] **Database TLS:** How does the backend configure database SSL? *(`DB_SSL === "false"` disables SSL; all other values enable SSL with `{ rejectUnauthorized: false }`).*
- [x] **CI/CD Authentication:** How does GitHub Actions authenticate with AWS? *(Via OpenID Connect (OIDC) assuming an IAM role using `aws-actions/configure-aws-credentials@v4`).*
- [x] **Container Builds:** How are containers packaged? *(Backend: `node:20-alpine`; Frontend: multi-stage build using `node:20-alpine` builder and `nginx:alpine` runner with SPA fallback).*
- [x] **Local Parity:** How does local development work? *(Docker Compose runs `postgres:18.4`, `backend` on port 3000, and `frontend` on port 5000, connected via a bridge network).*
- [x] **Secret Management:** Where are database passwords stored? *(AWS Secrets Manager secret `cloudapp-db-secret`, injected into ECS task definitions).*
- [x] **Testing:** What tests are automated? *(52 automated tests across backend and frontend: 23 Jest/Supertest backend unit/API tests with 97.46% statement coverage; 8 real PostgreSQL integration tests with safety guard and SQL injection resilience; 21 Vitest/React Testing Library frontend tests covering modal forms, tables, loading spinners, empty states, and error alerts; plus GitHub Actions CI quality gates blocking deployment on any test failure).*

---

## 39. Source-of-Truth and Verification Rules

1. **Codebase Over Documentation:** Whenever `README.md` or tutorial files (`instruction.md`) conflict with active source code or configuration files, the source code and configuration files represent ground truth. Specifically:
   - Backend routes are `/api/items/getitems`, `/api/items/createitems`, and `/api/metrics`.
   - Frontend styling imports only `styles/global.css`.
   - S3 and CloudFront are documented in narrative logs, but are not provisioned in checked-in Terraform.
2. **Explicit Fact vs. Inference:**
   - **Fact:** The repository provisions VPC, ECS, RDS, ALB, ECR, CloudWatch, and Secrets Manager via Terraform.
   - **Fact:** The backend validates item names between 2 and 100 characters.
   - **Fact:** Application-level authentication is not implemented.
   - **Architectural Inference:** The application is intended as a cloud engineering portfolio/demonstration project based on documentation and infrastructure choices.
3. **No Secret Exposure:** Secrets, private keys, database passwords, and IAM role ARNs must always be represented by safe placeholders.

---

## 40. Final Technical Summary

The **Cloud-Native AWS Application** (`cloudapp`) is a cloud-native reference implementation consisting of:
- A **React 19 SPA** built with Vite and React Router, packaged in an Nginx Alpine container.
- An **Express.js 5 REST API** on Node.js 20 Alpine, hardened with Helmet, Morgan, and express-validator, using connection pooling against PostgreSQL.
- An **Amazon RDS PostgreSQL 15** relational database running in isolated private database subnets with KMS encryption.
- A **3-Tier AWS VPC** across two Availability Zones provisioned via modular **Terraform (>= 1.5)**, incorporating an Application Load Balancer, NAT Gateway, chained security groups, and **AWS ECS Fargate** serverless containers.
- A comprehensive multi-tier automated test suite (52 tests across Jest/Supertest backend unit/API tests, real PostgreSQL integration tests, and Vitest/React Testing Library frontend tests) delivering 97.46% backend statement coverage.
- An automated **CI/CD Pipeline in GitHub Actions** utilizing **AWS OIDC** for keyless deployment, enforcing strict quality gates (`backend-tests` with PostgreSQL 16 container, `frontend-checks` with lint/test/build, and `terraform-checks` with format/validation) before building Docker containers, pushing to **Amazon ECR**, and orchestrating rolling ECS updates with zero downtime.
