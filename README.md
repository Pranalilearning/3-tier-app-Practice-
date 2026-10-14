# Cloud-Native Full-Stack Application — AWS

![AWS](https://img.shields.io/badge/AWS-Cloud-orange)
![React](https://img.shields.io/badge/React-Frontend-blue)
![Node.js](https://img.shields.io/badge/Node.js-Backend-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)
![Docker](https://img.shields.io/badge/Docker-Containerization-blue)
![ECS](https://img.shields.io/badge/Amazon-ECS-orange)
![Terraform](https://img.shields.io/badge/Terraform-IaC-purple)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-CI%2FCD-blue)
![CloudFront](https://img.shields.io/badge/Amazon-CloudFront-orange)

A full-stack, cloud-native application demonstrating end-to-end software development, containerization, Infrastructure as Code (IaC), AWS cloud deployment, and CI/CD automation. The system pairs a React single-page frontend with an Express REST API and PostgreSQL database, deploying containerized backend services to AWS ECS Fargate behind an Application Load Balancer (ALB). Cloud infrastructure is fully codified using modular Terraform across isolated VPC networking tiers, with automated testing and continuous deployment managed via GitHub Actions and AWS OIDC.

<p align="center">
  <img src="docs/dashboard_screenshots/overview.png" alt="CloudOps Overview — Main Infrastructure Dashboard" width="100%">
</p>

---

## Overview

- **What the application does:** Provides an interactive web dashboard for listing and creating items. The user interface allows users to view stored items in real time and submit new records through validated forms.
- **Frontend/backend architecture:** A decoupled client-server architecture. The frontend is a React 19 single-page application built with Vite and React Router, communicating via Axios with a Node.js/Express REST API that handles HTTP routing, request validation, process metrics, and database access.
- **Database layer:** PostgreSQL serves as the persistent relational data store. The backend connects using a pooled `pg.Pool` client with parameterized SQL queries to safeguard against SQL injection and optimize connection reuse.
- **Cloud deployment approach:** The backend is containerized with Docker and deployed to serverless AWS ECS Fargate tasks running inside private subnets. Ingress traffic is managed by an AWS Application Load Balancer in public subnets. Database storage is provisioned via an encrypted, private Amazon RDS PostgreSQL instance.
- **Why the project was built:** Developed as a practical, production-style software engineering and cloud implementation to demonstrate full-stack development, defensive API design, container lifecycle management, infrastructure automation, least-privilege cloud security, and automated continuous delivery.

---

## Dashboard Preview

The application features **CloudOps**, an enterprise-grade cloud management console designed for real-time observability, data management, and container fleet orchestration:

### Items Management
> Query, search, and register database records stored in PostgreSQL with instant table synchronization and input-validated modals.

<p align="center">
  <img src="docs/dashboard_screenshots/items-management.png" alt="Items Management — Database Records, Search, and Create-Item Interface" width="100%">
</p>

### Infrastructure Topology
> Interactive service map visualizing Docker container states, exposed network ports, runtime specifications, and bridge network DNS routing configurations.

<p align="center">
  <img src="docs/dashboard_screenshots/infrastructure.png" alt="Infrastructure Topology — Docker Services, Ports, and Network Architecture" width="100%">
</p>

### Real-Time Activity Feed
> Real-time audit telemetry, container lifecycle events, database synchronization milestones, and automated health check status indicators.

<p align="center">
  <img src="docs/dashboard_screenshots/activity.png" alt="Activity Feed — Activity Logs, Timestamps, and Status Indicators" width="100%">
</p>

---

## Key Features

- **React Single-Page Application:** Built with React 19, Vite, and React Router DOM, featuring dynamic data fetching, client-side routing, and error state handling.
- **Express.js REST API:** Structured backend utilizing Express 5, Helmet HTTP security headers, CORS middleware, and Morgan request logging.
- **PostgreSQL Persistence:** Relational data persistence with connection pooling (`pg.Pool`), parameterized queries, and database readiness health checks.
- **Request Validation & Error Handling:** Schema validation using `express-validator` to enforce boundary constraints (2–100 characters) and centralized Express error handling.
- **Docker Containerization:** Optimized Dockerfiles for both frontend (multi-stage build with Nginx) and backend (`node:20-alpine`), alongside local multi-service orchestration via Docker Compose.
- **AWS ECS Fargate Deployment:** Serverless container execution for backend workloads running within private VPC subnets with CloudWatch logging and container health checks.
- **Application Load Balancer (ALB):** Public HTTP traffic distribution across ECS Fargate tasks with automated target group health probing (`/health`).
- **Infrastructure as Code with Terraform:** Modular configuration (`networking`, `security`, `database`, `compute`) provisioning VPC, subnets, route tables, security groups, RDS, ECR, ALB, ECS, IAM, and CloudWatch.
- **Automated CI/CD Pipeline:** GitHub Actions workflow triggering on code pushes to test code, build Docker images, push to Amazon ECR, update ECS task definitions, and verify deployment stability.
- **Keyless AWS OIDC Authentication:** GitHub Actions assumes an AWS IAM role dynamically using OpenID Connect (OIDC), eliminating static, long-lived AWS credentials.
- **Secrets Management:** Amazon Secrets Manager securely stores database credentials and injects them directly into ECS container environments at task launch.
- **Centralized CloudWatch Logging:** Application and container logs routed to an AWS CloudWatch Log Group with configurable 14-day retention.
- **Automated Testing:** Backend test suite leveraging Jest and Supertest to validate API contracts, input validation rules, and database failure scenarios.

---

## Architecture

### Cloud Architecture Diagram

![Architecture](docs/architecture-diagram-2.png)

*Figure 1: Full-stack cloud deployment topology across AWS VPC networking tiers.*

![Architecture Diagram](docs/architecture-diagram.png)

*Figure 2: Three-tier cloud application architecture.*

### System Request Flow (AWS Cloud)

```text
       Internet Users / Web Clients
                   │
                   ▼
     Application Load Balancer (ALB)
          [Public Subnets: Port 80]
                   │
                   ▼ (HTTP Port 3000)
       ECS Fargate Service Tasks
         [Private Subnets: No Public IP]
         ├── Express.js REST API
         ├── Helmet & CORS Middleware
         └── Input Validation & pg.Pool
                   │
                   ▼ (PostgreSQL Port 5432)
         Amazon RDS PostgreSQL
       [Isolated Database Subnets]
```

### Local Multi-Container Topology (Docker Compose)

```text
                   Browser Client
                         │
        ┌────────────────┴────────────────┐
        ▼ (Port 5000:80)                  ▼ (Port 3000:3000)
  frontend container                backend container
 (Vite build + Nginx)               (Express.js API)
        │                                 │
        │ HTTP API Calls (Axios)          │ pg.Pool (Port 5432)
        └────────────────────────────────►│
                                          ▼
                                postgres-db container
                                  (PostgreSQL 18.4)
```

### Supporting Infrastructure Provisioned by Terraform

```text
                        Terraform Root Module
                                  │
         ┌───────────────┬────────┴───────┬───────────────┐
         ▼               ▼                ▼               ▼
     networking       security         database        compute
         │               │                │               │
  • VPC (10.0.0.0/16)  • ALB SG         • DB Subnet     • ECR Repo
  • 2 Public Subnets   • ECS SG           Group         • ECS Cluster
  • 2 Private Subnets  • RDS SG         • Secrets       • ALB & Listener
  • 2 DB Subnets       (Tiered Ingress    Manager       • Target Group
  • IGW & NAT Gateway   Rules)          • RDS Postgres  • Task Def & Service
  • Route Tables                          (Private 15)  • IAM Roles & Logs
```

---

## Application Screenshots

### Backend API JSON Response

![Output JSON](docs/outputjson.png)

*Figure 3: Sample JSON payload returned from the backend REST API running on the cloud infrastructure.*

---

## Technology Stack

| Category | Technology | Version / Spec | Purpose |
|---|---|---|---|
| **Frontend** | React | `^19.2.6` | Component-based user interface |
| | Vite | `^8.0.12` | Frontend build tool and development server |
| | React Router DOM | `^7.15.1` | Client-side routing (`BrowserRouter`, `Routes`, `Route`) |
| | Axios | `^1.16.1` | HTTP client for backend REST API communication |
| **Backend** | Node.js | `20.x` (Alpine) | Server-side JavaScript runtime |
| | Express.js | `^5.2.1` | Web framework and REST API routing |
| | express-validator | `^7.3.2` | Request body validation and sanitization |
| | Helmet | `^8.1.0` | HTTP security header protection |
| | CORS | `^2.8.6` | Cross-Origin Resource Sharing handling |
| | Morgan | `^1.10.1` | HTTP request logging (disabled during tests) |
| | dotenv | `^17.4.2` | Environment configuration loading |
| **Database** | PostgreSQL | 15 (AWS RDS) / 18.4 (Local) | Relational database storage |
| | pg (`node-postgres`) | `^8.21.0` | PostgreSQL client and connection pooling |
| **Cloud / AWS** | Amazon ECS Fargate | Serverless container compute | Runs backend container tasks |
| | Application Load Balancer | AWS ALB | Ingress routing, health checks, and traffic balancing |
| | Amazon RDS PostgreSQL | `db.t3.micro`, gp3 | Managed relational database storage |
| | Amazon ECR | Docker registry | Secure, immutable container image storage |
| | Amazon VPC | Multi-AZ (6 subnets) | Isolated network architecture across 3 distinct tiers |
| | AWS NAT Gateway & IGW | AWS VPC Networking | Outbound internet access for private workloads |
| | AWS Secrets Manager | AWS Secrets | Encrypted credential storage for database passwords |
| | AWS IAM & OIDC | OpenID Connect & Roles | Least-privilege execution roles and keyless CI/CD |
| | Amazon CloudWatch | Logs (`/ecs/cloudapp-backend`) | Container log aggregation with 14-day retention |
| **Infrastructure as Code** | Terraform | `>= 1.5` (AWS Provider `~> 5.0`) | Declarative, modular cloud infrastructure provisioning |
| **Containers** | Docker | Multi-stage Dockerfiles | Container packaging for frontend (Nginx) and backend |
| | Docker Compose | Compose v2 | Local multi-container development environment |
| **CI/CD** | GitHub Actions | Workflows (`deploy.yml`) | Automated linting/testing, container builds, and deployment |
| **Testing** | Jest | `^30.4.2` | Automated test runner and assertion library |
| | Supertest | `^7.2.2` | HTTP integration testing for Express routes |
| **Development Tools** | ESLint | `^10.3.0` | Frontend static code analysis |
| | Nodemon | `^3.1.14` | Backend hot-reload development server |

---

## Backend & REST APIs

The backend follows a modular Express architecture structured around route definitions, request validation middleware, controller handlers, and pooled PostgreSQL queries:

- **Routes (`backend/src/routes/`):** Define API endpoints and associate middleware pipelines with controller methods.
- **Controllers (`backend/src/controllers/`):** Request handlers that execute database queries directly through the connection pool, format JSON responses, and forward unhandled exceptions to Express error handling.
- **Middleware (`backend/src/middleware/`):**
  - `validate.js`: Evaluates `express-validator` results, immediately returning `400 Bad Request` with structured error arrays upon validation failure.
  - `errorHandler.js`: Centralized error handler catching uncaught exceptions and returning a standard `500 Internal Server Error` response.
  - `helmet()`: Applies HTTP response security headers.
  - `cors()`: Enables cross-origin request processing.
  - `morgan("dev")`: Formats incoming request logs (active in non-test environments).
- **Validation (`backend/src/validators/`):** Declares declarative validation chains (`body("name").trim().notEmpty().isLength({ min: 2, max: 100 })`).
- **Database Interaction (`backend/src/db/`):** Exports a shared `pg.Pool` instance configured with connection limits, event listeners (`connect`, `error`), and parameterized query execution (`$1`).
- **Authentication:** All current API endpoints are unauthenticated. The application relies on network-level security boundaries (ALB security groups and private VPC subnets) rather than token/session-based application authentication.

### Implemented REST API Endpoints

| Method | Endpoint | Description | Request Body | Success Response | Error Responses |
|---|---|---|---|---|---|
| `GET` | `/` | Root API status probe | None | `200 OK`<br>`{"message":"Backend API running successfully"}` | — |
| `GET` | `/health` | Application & database readiness probe | None | `200 OK`<br>`{"status":"OK","uptime":<seconds>,"timestamp":<ISO>}` | `503 Service Unavailable`<br>`{"status":"UNAVAILABLE","message":"Database is unavailable"}` |
| `GET` | `/api/items/getitems` | Retrieve all items from PostgreSQL | None | `200 OK`<br>`{"success":true,"count":<num>,"data":[{id,name},...]}` | `500 Internal Server Error`<br>`{"error":"Internal Server Error"}` |
| `POST` | `/api/items/createitems` | Validate and insert a new item | `{"name":"string"}` | `201 Created`<br>`{"success":true,"data":{"id":1,"name":"Sample"}}` | `400 Bad Request`<br>`{"success":false,"errors":[...]}`<br>`500 Internal Server Error` |
| `GET` | `/api/metrics` | Node.js process resource snapshot | None | `200 OK`<br>`{"uptime":<seconds>,"memoryUsage":{...},"timestamp":<ISO>}` | — |

---

## Database

- **Engine:** PostgreSQL (version 15 on AWS RDS; version 18.4 in local Docker Compose).
- **Driver:** `pg` (`node-postgres`) connection pool configured via environment variables in `backend/src/config/env.js`.
- **SSL / TLS:** Configurable via `DB_SSL`. In AWS ECS tasks, `DB_SSL=true` is supplied to enforce encrypted connections to RDS; in local development, `DB_SSL=false` allows non-SSL local database communication.
- **Schema Script (`backend/src/db/schema.sql`):**
  ```sql
  CREATE TABLE IF NOT EXISTS items (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL
  );
  ```
- **Tables & Relationships:** Single table `items` with an auto-incrementing 64-bit integer primary key (`id`) and a non-nullable varchar field (`name`).
- **Local Initialization:** Mounted into `/docker-entrypoint-initdb.d/01-schema.sql` in Docker Compose, ensuring automatic table creation when the PostgreSQL volume is initialized.

---

## Docker & Containerization

### Backend Container (`backend/Dockerfile`)

- Built using the official `node:20-alpine` base image for minimal image footprint and reduced attack surface.
- Leverages Docker layer caching by copying `package.json` and `package-lock.json` prior to running `npm ci`.
- Exposes port `3000` and starts the application using `npm start`.

### Frontend Container (`frontend/Dockerfile`)

- Uses a multi-stage Docker build:
  1. **Builder Stage:** `node:20-alpine` installs dependencies (`npm ci`), accepts build argument `VITE_API_URL`, and compiles production static assets with `npm run build`.
  2. **Production Stage:** `nginx:alpine` copies compiled assets into `/usr/share/nginx/html` and mounts a custom `nginx.conf` that configures client-side SPA route fallback (`try_files $uri $uri/ /index.html;`) on port `80`.

### Docker Compose Orchestration (`docker-compose.yml`)

The repository includes a complete local development environment wiring three containers onto an isolated bridge network (`app-network`):

1. **`postgres-db`:** Runs `postgres:18.4`, exposes port `5432`, mounts `schema.sql` for auto-initialization, persists data to named volume `postgres_data`, and defines an automated healthcheck using `pg_isready`.
2. **`backend`:** Builds from `./backend`, connects to `postgres-db:5432`, maps host port `3000:3000`, and uses `depends_on` with `condition: service_healthy` to guarantee the database is fully responsive before launching the API.
3. **`frontend`:** Builds from `./frontend` passing `VITE_API_URL=http://localhost:3000`, maps host port `5000:80`, and depends on `backend`.

---

## AWS Architecture

The AWS cloud infrastructure is provisioned through Terraform, enforcing isolation, least privilege, and high availability across multiple availability zones:

```text
+-----------------------------------------------------------------------------------+
| AWS Cloud (Region: ap-south-1)                                                    |
|                                                                                   |
|  VPC: 10.0.0.0/16                                                                 |
|                                                                                   |
|  +-------------------------------------+   +------------------------------------+ |
|  | Availability Zone A                 |   | Availability Zone B                | |
|  |                                     |   |                                    | |
|  | [Public Subnet A: 10.0.1.0/24]      |   | [Public Subnet B: 10.0.2.0/24]     | |
|  |  ├── Internet Gateway Route         |   |  ├── Internet Gateway Route        | |
|  |  ├── NAT Gateway (Elastic IP)       |   |  └── Application Load Balancer     | |
|  |  └── Application Load Balancer      |   |      (Port 80 Listener)            | |
|  |      (Port 80 Listener)             |   |                                    | |
|  +------------------┬------------------+   +-----------------┬------------------+ |
|                     │                                        │                    |
|                     ▼ (Inbound Port 3000 restricted to ALB)  ▼                    |
|  +-------------------------------------+   +------------------------------------+ |
|  | [Private ECS Subnet A: 10.0.11.0/24]|   | [Private ECS Subnet B: 10.0.12.0/24| |
|  |  ├── Route -> NAT Gateway           |   |  ├── Route -> NAT Gateway          | |
|  |  └── ECS Fargate Task (Backend API) |   |  └── ECS Fargate Task (Backend API)| |
|  |      • CloudWatch Logs Integration  |   |      • CloudWatch Logs Integration | |
|  |      • IAM Task Execution Role      |   |      • IAM Task Execution Role     | |
|  +------------------┬------------------+   +-----------------┬------------------+ |
|                     │                                        │                    |
|                     ▼ (Inbound Port 5432 restricted to ECS)  ▼                    |
|  +------------------------------------------------------------------------------+ |
|  | [Isolated DB Subnet A: 10.0.21.0/24]   [Isolated DB Subnet B: 10.0.22.0/24]  | |
|  |  └── Amazon RDS PostgreSQL (Port 5432, No Public IP, KMS-Encrypted)          | |
|  +------------------------------------------------------------------------------+ |
+-----------------------------------------------------------------------------------+
```

### Verified AWS Services and Roles

- **Amazon VPC (`10.0.0.0/16`):** Provides network isolation across 6 subnets distributed across 2 Availability Zones (`public-a`, `public-b`, `private-a`, `private-b`, `db-a`, `db-b`).
- **Internet Gateway & NAT Gateway:** The Internet Gateway provides public ingress to the ALB; a single NAT Gateway with an Elastic IP in `public-a` provides secure outbound internet connectivity for private ECS tasks (e.g., pulling container images and writing logs).
- **Application Load Balancer (ALB):** Public-facing load balancer distributing HTTP traffic on port 80 across ECS Fargate targets in private subnets, with health checks probing `/health` every 30 seconds.
- **Amazon ECS Fargate:** Serverless compute cluster (`cloudapp-dev`) running backend tasks without EC2 instance management. Tasks are assigned 256 CPU units (0.25 vCPU) and 512 MB memory.
- **Amazon ECR:** Private, immutable container repository (`cloudapp-backend`) configured with scan-on-push vulnerability inspection.
- **Amazon RDS PostgreSQL:** Managed PostgreSQL 15 database (`db.t3.micro`, 20 GB gp3 storage, KMS storage encryption, 7-day automated backups, private subnet placement, non-publicly accessible).
- **AWS Secrets Manager:** Securely stores database master credentials (`username` and `password`) as a JSON secret (`cloudapp-db-secret`), referenced by ARN during ECS task initialization.
- **AWS IAM Roles:**
  - **ECS Execution Role:** Grants Fargate permission to pull images from ECR, stream logs to CloudWatch (`AmazonECSTaskExecutionRolePolicy`), and an inline policy granting `secretsmanager:GetSecretValue` on the database secret ARN.
  - **ECS Task Role:** Scoped IAM role assumed by the running application container.
- **Amazon CloudWatch:** Log group `/ecs/cloudapp-backend` capturing container STDOUT/STDERR logs with a 14-day retention policy.

### Security Group Tiering

| Security Group | Ingress Rules | Egress Rules | Security Boundary |
|---|---|---|---|
| **ALB Security Group** (`cloudapp-alb-sg`) | TCP 80 & 443 from `0.0.0.0/0` | All traffic (`0.0.0.0/0`) | Public entry point for application HTTP/S traffic |
| **ECS Security Group** (`cloudapp-ecs-sg`) | TCP 3000 restricted to `cloudapp-alb-sg` | All traffic (`0.0.0.0/0`) | Backend tasks only accept traffic originating from ALB |
| **RDS Security Group** (`cloudapp-rds-sg`) | TCP 5432 restricted to `cloudapp-ecs-sg` | All traffic (`0.0.0.0/0`) | Database only accepts connections originating from ECS tasks |

---

### AWS Deployment & Infrastructure Screenshots

#### Amazon ECS Fargate Cluster
![ECS](docs/ecs-photo.png)

#### Amazon ECR Container Repository
![ECR](docs/ecr-photo.png)

#### Application Load Balancer
![ALB](docs/alb.jpg)

#### ALB Target Group & Health Probes
![ALB Target Group](docs/alb-target-group.png)

#### Amazon RDS PostgreSQL Instance
![RDS](docs/rds.png)

#### Amazon CloudWatch Log Group
![CloudWatch](docs/cloudwatch-logs.png)

---

### Historical CloudFront & S3 Deployment Exploration

> [!NOTE]
> The screenshots below document earlier manual explorations into hosting static frontend assets via Amazon S3 and CloudFront CDN. In the current automated Terraform and Docker configuration, the frontend is packaged via a multi-stage Dockerfile and served via Nginx.

#### Amazon CloudFront CDN Distribution
![CloudFront](docs/cloudfront-distribution.png)

#### CloudFront Origin Settings
![CloudFront Settings](docs/cloudfront-edited.png)

#### Amazon S3 Static Hosting Bucket
![S3](docs/s3-hosting.png)

---

## Infrastructure as Code

Terraform configuration is located in `terraform/` and follows a structured module pattern:

```text
terraform/
├── main.tf             # Root module invoking child modules
├── variables.tf        # Root input variable definitions
├── outputs.tf          # Root output exports (ALB DNS, ECR URL, RDS endpoint, etc.)
├── providers.tf        # AWS provider declaration
├── versions.tf         # Terraform and provider version pinning
└── modules/
    ├── networking/     # VPC, 6 subnets, IGW, EIP, NAT Gateway, Route Tables
    ├── security/       # ALB, ECS, and RDS security groups
    ├── database/       # DB subnet group, Secrets Manager secret, RDS PostgreSQL
    └── compute/        # ECR, ECS cluster, ALB, target group, task def, service, IAM, logs
```

### Terraform Capabilities Implemented

- **Decoupled Compute Provisioning:** The compute module uses `local.ecs_enabled = var.backend_image != ""`. When `backend_image` is empty (default), Terraform provisions the VPC, networking, database, ECR, ALB, and IAM roles without failing on a nonexistent Docker image. Once an image is built and pushed to ECR, setting `backend_image` provisions the ECS task definition and service.
- **Drift-Safe Service Lifecycle:** The ECS service resource declares `lifecycle { ignore_changes = [task_definition] }`, ensuring that CI/CD deployments updating the task definition do not conflict with subsequent `terraform apply` operations.
- **Secret Injection:** Database credentials stored in Secrets Manager are injected into container environment variables (`DB_USER`, `DB_PASSWORD`) via `secrets` blocks in the task definition.

### Terraform Commands

```bash
cd terraform

# Initialize Terraform providers and backend
terraform init

# Check code formatting
terraform fmt -recursive

# Validate configuration syntax
terraform validate

# Generate and inspect an execution plan
terraform plan -var="db_password=YourSecurePassword123"

# Apply infrastructure changes
terraform apply -var="db_password=YourSecurePassword123"
```

---

## CI/CD Pipeline

The repository implements automated CI/CD using GitHub Actions defined in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

### Pipeline Workflow Stages

```text
 Git Push to master
         │
         ▼
 1. Check out repository (actions/checkout@v4)
         │
         ▼
 2. Set up Node.js 20 environment (actions/setup-node@v4)
         │
         ▼
 3. Install backend dependencies (npm ci)
         │
         ▼
 4. Run automated test suite (npm test via Jest & Supertest)
         │
         ▼
 5. Authenticate to AWS via OIDC (aws-actions/configure-aws-credentials@v4)
         │
         ▼
 6. Authenticate to Amazon ECR (aws-actions/amazon-ecr-login@v2)
         │
         ▼
 7. Build Docker image and tag: ${SHA}-${RUN_ID}-${RUN_ATTEMPT}
         │
         ▼
 8. Push tagged image to Amazon ECR
         │
         ▼
 9. Download active ECS task definition (aws ecs describe-task-definition)
         │
         ▼
10. Render task definition with new image tag (amazon-ecs-render-task-definition@v1)
         │
         ▼
11. Deploy task definition to ECS service & wait for stability (amazon-ecs-deploy-task-definition@v2)
```

### AWS OIDC Authentication

The pipeline authenticates to AWS using OpenID Connect (OIDC) rather than long-lived IAM user access keys:
- The workflow requests token permission (`permissions: id-token: write`).
- `aws-actions/configure-aws-credentials@v4` exchanges GitHub's OIDC JWT token for short-lived AWS STS temporary credentials using `secrets.AWS_ROLE_TO_ASSUME`.
- This eliminates the risk of credential leakage and adheres to AWS security best practices.

---

## Testing

The backend includes an automated integration test suite built with **Jest** and **Supertest** located in `backend/tests/`:

- **Health Probe Test (`backend/tests/health.test.js`):**
  - Asserts that `GET /health` returns status `200` with status `"OK"`, a numeric `uptime`, and a valid ISO timestamp string when database connectivity succeeds (`SELECT 1`).
  - Asserts that `GET /health` returns status `503` with status `"UNAVAILABLE"` when the database query fails.
- **Items API Test (`backend/tests/items.test.js`):**
  - Asserts that `GET /api/items/getitems` queries PostgreSQL (`SELECT * FROM items`) and returns status `200` with the complete list of rows and item count.
  - Asserts that `POST /api/items/createitems` successfully passes validation, invokes a parameterized SQL insert (`INSERT INTO items (name) VALUES ($1) RETURNING *`), and returns status `201` with the created item.
  - Asserts that `POST /api/items/createitems` rejects invalid or empty input (`name: ""`) with status `400 Bad Request` and `success: false` without triggering any database queries.

### Running Tests

Execute the test suite from the `backend/` directory:

```bash
cd backend
npm test
```

To run tests in watch mode during development:

```bash
cd backend
npm run test:watch
```

---

## Local Development

### Prerequisites

- Node.js (version 20.x recommended) and npm
- PostgreSQL (version 15+ installed locally, or running via Docker)
- Git

### Setup Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/tanyaverma20/Cloud-Native-AWS-Application.git
   cd Cloud-Native-AWS-Application
   ```

2. **Set up and start the PostgreSQL database:**
   Ensure PostgreSQL is running locally on port `5432` with a database named `cloudapp`:
   ```bash
   psql -U postgres -c "CREATE DATABASE cloudapp;"
   psql -U postgres -d cloudapp -f backend/src/db/schema.sql
   ```

3. **Install dependencies and configure backend:**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend/` directory:
   ```env
   NODE_ENV=development
   PORT=3000
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_NAME=cloudapp
   DB_SSL=false
   ```
   Start the backend server:
   ```bash
   npm run dev
   # Server runs on http://localhost:3000
   ```

4. **Install dependencies and configure frontend:**
   Open a new terminal session:
   ```bash
   cd frontend
   npm install
   ```
   Create a `.env` file in the `frontend/` directory (optional; defaults to `http://localhost:3000`):
   ```env
   VITE_API_URL=http://localhost:3000
   ```
   Start the frontend development server:
   ```bash
   npm run dev
   # Vite development server runs on http://localhost:5173
   ```

5. **Run tests:**
   ```bash
   cd backend
   npm test
   ```

---

## Docker Development

The entire multi-tier stack (PostgreSQL database, Express API, and Nginx-hosted React frontend) can be launched simultaneously with a single Docker Compose command:

```bash
docker compose up --build
```

### Accessing Local Services

- **Frontend Application:** `http://localhost:5000`
- **Backend API:** `http://localhost:3000`
- **Backend Health Check:** `http://localhost:3000/health`
- **PostgreSQL Database:** `localhost:5432` (User: `postgres`, Password: `root`, Database: `cloudapp`)

To tear down containers and delete the associated database volume:

```bash
docker compose down -v
```

---

## AWS Deployment

### 1. Provision Infrastructure with Terraform

```bash
cd terraform

# Initialize and validate
terraform init
terraform validate

# Plan and apply core infrastructure (ECR, VPC, RDS, ALB, IAM)
# Leave backend_image empty on initial apply
terraform apply -var="db_password=YourSecureDbPassword"
```

Save the outputs: `alb_dns_name`, `ecr_repository_url`, `ecs_cluster_name`, `ecs_service_name`, and `db_endpoint`.

### 2. Build and Push Initial Backend Docker Image

```bash
# Authenticate Docker to Amazon ECR
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin <ECR_REPOSITORY_URL>

# Build the backend container image
docker build -t cloudapp-backend ./backend

# Tag and push the image to ECR
docker tag cloudapp-backend:latest <ECR_REPOSITORY_URL>:v1.0.0
docker push <ECR_REPOSITORY_URL>:v1.0.0
```

### 3. Provision ECS Task Definition and Service

Update `terraform/terraform.tfvars` or pass `backend_image` via command line:

```bash
terraform apply \
  -var="db_password=YourSecureDbPassword" \
  -var="backend_image=<ECR_REPOSITORY_URL>:v1.0.0"
```

### 4. Initialize Database Schema

Once RDS PostgreSQL is provisioned, apply the initial schema from an authorized network (such as an EC2 bastion or through an SSM session inside the VPC):

```bash
psql -h <DB_ENDPOINT> -U postgres -d cloudapp -f backend/src/db/schema.sql
```

### 5. Automated CI/CD Deployments

Configure the following GitHub repository secrets and variables under **Settings > Secrets and variables > Actions**:

- **Repository Secret:**
  - `AWS_ROLE_TO_ASSUME`: ARN of the AWS IAM role trusted by the repository's GitHub OIDC provider.
- **Repository Variables:**
  - `AWS_REGION`: `ap-south-1`
  - `ECR_REPOSITORY`: `cloudapp-backend`
  - `ECS_CLUSTER`: `cloudapp-dev`
  - `ECS_SERVICE`: `cloudapp-backend`
  - `ECS_TASK_DEFINITION`: `cloudapp-backend`

Any push to the `master` branch will automatically execute backend unit/integration tests, build and push the image to ECR with unique commit tags, update the ECS task definition, and deploy the new revision to the ECS service with automated stability checks.

---

## Environment Variables

### Backend Configuration (`backend/` or Docker environment)

| Variable | Description | Default | Required in Production |
|---|---|---|---|
| `NODE_ENV` | Application environment mode (`development`, `test`, `production`) | `development` | Yes (`production`) |
| `PORT` | HTTP server port | `3000` | No |
| `DB_HOST` | PostgreSQL host endpoint | — | Yes (RDS endpoint) |
| `DB_PORT` | PostgreSQL port | `5432` | Yes |
| `DB_USER` | PostgreSQL username | — | Yes (injected from Secrets Manager) |
| `DB_PASSWORD` | PostgreSQL password | — | Yes (injected from Secrets Manager) |
| `DB_NAME` | PostgreSQL database name | `cloudapp` | Yes |
| `DB_SSL` | Set to `"false"` to disable TLS; any other value enables TLS with `{rejectUnauthorized: false}` | Enabled | Yes (`true` for RDS) |

### Frontend Configuration (`frontend/` or Docker build arg)

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Base URL for backend API requests via Axios | `http://localhost:3000` |

### Terraform Variables (`terraform/variables.tf`)

| Variable | Description | Default | Sensitive |
|---|---|---|---|
| `aws_region` | Target AWS region | `ap-south-1` | No |
| `project_name` | Name prefix used for tagged cloud resources | `cloudapp` | No |
| `environment` | Deployment environment tier | `dev` | No |
| `db_password` | Master password for PostgreSQL database | — | Yes |
| `db_username` | Master username for PostgreSQL database | `postgres` | No |
| `db_name` | Initial database name | `cloudapp` | No |
| `backend_image` | Full ECR image URI and tag for ECS service | `""` (empty skips ECS service) | No |

---

## Project Structure

```text
Cloud-Native-AWS-Application/
├── .github/
│   └── workflows/
│       └── deploy.yml              # CI/CD pipeline: test, build, push to ECR, deploy to ECS
├── backend/
│   ├── Dockerfile                  # Container definition for Node.js Express service
│   ├── package.json                # Dependencies, scripts (start, dev, test)
│   ├── server.js                   # HTTP server entrypoint
│   ├── src/
│   │   ├── app.js                  # Express middleware and router setup
│   │   ├── config/
│   │   │   └── env.js              # Environment variable parsing and defaults
│   │   ├── controllers/
│   │   │   └── itemController.js   # API controllers for item operations
│   │   ├── db/
│   │   │   ├── index.js            # PostgreSQL connection pool (pg.Pool)
│   │   │   └── schema.sql          # Database table schema definition
│   │   ├── middleware/
│   │   │   ├── errorHandler.js     # Centralized 500 error handler (sanitized responses)
│   │   │   └── validate.js         # Request validation evaluation middleware
│   │   ├── routes/
│   │   │   ├── healthRoutes.js     # GET /health database readiness probe
│   │   │   ├── itemRoutes.js       # GET /api/items/getitems, POST /api/items/createitems
│   │   │   └── metricRoutes.js     # GET /api/metrics process metrics endpoint
│   │   └── validators/
│   │       └── itemValidator.js    # express-validator rules for item payload (string, 2-100 chars)
│   └── tests/
│       ├── health.test.js          # Supertest/Jest tests for /health, /, /api/metrics, 404, bad JSON
│       ├── items.test.js           # Supertest/Jest tests for /api/items endpoints & input validation
│       └── integration/
│           ├── dbTestHelper.js     # Dedicated test DB pool, safety guard & schema executor
│           └── items.integration.test.js # Real PostgreSQL integration tests (schema, SQL injection, constraints)
├── frontend/
│   ├── Dockerfile                  # Multi-stage container build (Node builder -> Nginx)
│   ├── nginx.conf                  # Nginx configuration with SPA route fallback
│   ├── package.json                # React 19, Vite, React Router, Axios, Vitest, RTL dependencies
│   ├── vite.config.js              # Vite & Vitest configuration with JSDOM
│   ├── index.html                  # HTML entry point
│   └── src/
│       ├── main.jsx                # React root rendering and BrowserRouter
│       ├── App.jsx                 # Route declarations & state management
│       ├── setupTests.js           # Test setup file configuring @testing-library/jest-dom
│       ├── __tests__/
│       │   ├── App.test.jsx        # End-to-end component workflow with mocked Axios
│       │   ├── ItemComponents.test.jsx # ItemForm and ItemList component unit tests
│       │   ├── ItemFormModal.test.jsx  # Modal form validation, trimming, and accessibility tests
│       │   └── ItemTable.test.jsx  # Table rendering, loading, empty, search, and retry tests
│       ├── api/
│       │   ├── healthApi.js        # Axios API calls to health endpoint
│       │   └── itemsApi.js         # Axios API calls to backend endpoints
│       ├── components/
│       ├── pages/
│       └── services/
│           └── api.js              # Shared Axios client instance with baseURL
├── terraform/
│   ├── main.tf                     # Root Terraform composition
│   ├── variables.tf                # Input variable declarations
│   ├── outputs.tf                  # Infrastructure output definitions
│   ├── providers.tf                # AWS provider configuration
│   ├── versions.tf                 # Required Terraform and provider versions
│   └── modules/
├── docker-compose.yml              # Local multi-tier orchestration (DB, API, frontend)
├── docker-compose.test.yml         # Isolated PostgreSQL test container for integration tests
└── README.md                       # Engineering documentation
```

---

## Testing Strategy & Quality Assurance

To align with production software engineering and QA automation standards, the application implements a multi-tier testing strategy covering unit, API contract, database integration, frontend component, and CI/CD quality gates.

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

### 1. Test Architecture & Coverage

| Test Suite | Framework | Scope / Coverage | Test Count | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Backend Unit & API** | Jest, Supertest | Route contracts, input validation, status codes, 404, bad JSON, safe 500 error sanitization | **23** | ✅ Passed |
| **PostgreSQL Integration** | Jest, Supertest, `pg` | Real PostgreSQL schema initialization, BigInt identity IDs, NOT NULL & length constraints, parameterized query SQL-injection resilience | **8** | ✅ Passed |
| **Frontend Automated** | Vitest, React Testing Library, JSDOM | Item list rendering, loading / empty / error / success states, modal input trimming, length boundaries, search filter, Axios mocks | **21** | ✅ Passed |
| **Frontend Lint & Build** | ESLint, Vite | Code quality, React hooks rules, production bundle generation | — | ✅ Passed |
| **Terraform IaC Checks** | Terraform CLI | Canonical formatting (`fmt -check`), syntax and provider validation (`validate`) | — | ✅ Configured |
| **Total Automated Tests** | — | Comprehensive end-to-end regression safety net | **52** | ✅ 100% Passing |

### 2. Test Execution Commands

#### Root Convenience Commands
Run test suites across both backend and frontend from the workspace root:

```bash
# Run all unit/API and frontend automated tests
npm run test

# Run backend unit tests only
npm run test:backend

# Run real PostgreSQL integration tests
npm run test:backend:integration

# Run backend unit tests with statement/branch coverage
npm run test:backend:coverage

# Run frontend tests
npm run test:frontend

# Run frontend linter and production build
npm run lint:frontend
npm run build:frontend

# Run complete test suite (unit, integration, and frontend)
npm run test:all
```

#### Backend Test Commands
Navigate to the `backend/` directory:

```bash
cd backend

# Run isolated unit and API tests (mocked database)
npm test

# Run unit tests explicitly
npm run test:unit

# Run real PostgreSQL integration tests against test database
npm run test:integration

# Generate detailed test coverage report
npm run test:coverage

# Run tests in watch mode during development
npm run test:watch
```

#### Frontend Test Commands
Navigate to the `frontend/` directory:

```bash
cd frontend

# Run frontend component tests in headless Vitest runner
npm test

# Run frontend tests in interactive watch mode
npm run test:watch

# Execute ESLint verification
npm run lint

# Build production bundle
npm run build
```

### 3. Real PostgreSQL Integration Test Prerequisites & Safety Guard

The integration test suite connects to a dedicated PostgreSQL database and executes `backend/src/db/schema.sql` to verify database behaviors that mocked tests cannot detect.

- **Strict Safety Guard:** The integration test harness (`dbTestHelper.js`) verifies that the database name contains `test` (e.g. `cloudapp_test`). It **aborts immediately** if pointed at a non-test database (e.g. `cloudapp`, `production_db`), preventing accidental schema alterations or data loss on development, staging, or production environments.
- **Local Test Database via Docker Compose:**
  ```bash
  # Spin up dedicated test PostgreSQL container on port 5432
  docker compose -f docker-compose.test.yml up -d

  # Run the real PostgreSQL integration test suite
  npm run test:backend:integration

  # Tear down test container when finished
  docker compose -f docker-compose.test.yml down -v
  ```
- **Automatic Fallback in Local Environments Without PostgreSQL:** If PostgreSQL is not running locally, the integration suite gracefully logs an advisory notice and avoids blocking unit test workflows. In the GitHub Actions CI pipeline, a dedicated PostgreSQL 16 service container is provisioned automatically.

### 4. CI/CD Automated Quality Gates (`.github/workflows/deploy.yml`)

The continuous deployment pipeline requires every check to pass before deployment:

1. **Backend Tests Job (`backend-tests`):**
   - Provisions an isolated PostgreSQL 16 container service with automated health checks.
   - Installs dependencies using `npm ci` and lockfile caching.
   - Executes 23 Jest/Supertest backend unit and contract tests.
   - Executes 8 real PostgreSQL integration tests against the container database.
2. **Frontend Checks Job (`frontend-checks`):**
   - Installs dependencies using `npm ci` and lockfile caching.
   - Executes ESLint to enforce React hooks and coding standards.
   - Executes 21 Vitest / React Testing Library automated tests.
   - Builds the production bundle (`vite build`) to detect compilation errors.
3. **Terraform Checks Job (`terraform-checks`):**
   - Validates canonical HCL formatting with `terraform fmt -check`.
   - Initializes modules and validates provider definitions with `terraform validate`.
4. **Deploy Job (`deploy`):**
   - Explicitly declares `needs: [backend-tests, frontend-checks, terraform-checks]`.
   - Halts immediately if any unit test, integration test, lint, or build fails.
   - Authenticates to AWS using keyless OIDC, builds and pushes Docker images to ECR, and triggers zero-downtime rolling deployment to ECS Fargate.

### 5. Defensive Error Handling & Input Validation

The application incorporates strict defensive programming practices:
- **String & Type Validation:** Rejects missing, null, empty, whitespace-only, numeric, boolean, array, and object payloads with HTTP 400.
- **Length Boundary Enforcement:** Enforces strict 2–100 character boundaries, accepting boundary cases (2 and 100 characters) and rejecting sub-2 and 101+ character strings.
- **Whitespace Normalization:** Automatically trims leading and trailing whitespace before database insertion.
- **Error Information Leak Protection:** Sanitizes HTTP 500 error responses so internal database table names, SQL queries, connection strings, or credentials are never leaked to clients.
- **Route Catch-All:** Handles unknown endpoints by returning a standard JSON 404 response (`{ success: false, message: "Route not found" }`).
- **Malformed JSON Handling:** Intercepts malformed request bodies and returns structured HTTP 400 Bad Request responses.

---

## Engineering Highlights

- **Tiered Multi-AZ Network Isolation:** Designed a 3-tier VPC architecture across two availability zones, strictly isolating public ingress (ALB), compute (ECS Fargate in private subnets with NAT routing), and data persistence (RDS in non-routable database subnets).
- **Chained Security Boundaries:** Implemented security group chaining where the ALB accepts public HTTP/S, ECS accepts traffic only from the ALB security group on port 3000, and RDS accepts connections only from the ECS security group on port 5432.
- **Serverless Container Workloads:** Eliminated host management overhead by deploying the backend API onto AWS ECS Fargate with CloudWatch container logging and automated health check evaluation.
- **Keyless CI/CD Automation:** Engineered a GitHub Actions workflow using OpenID Connect (OIDC) to obtain short-lived AWS STS credentials, securely building, scanning, pushing to ECR, and deploying to ECS with automated zero-downtime rolling updates.
- **Infrastructure as Code Modularity:** Codified cloud infrastructure in reusable Terraform modules with automated secret generation in Secrets Manager, drift-safe task definition lifecycles, and decoupled compute provisioning.
- **Defensive API Implementation:** Guarded API endpoints using Helmet HTTP security headers, connection pooling via `pg.Pool`, request schema validation via `express-validator`, and parameterized SQL execution.
- **Automated Integration Testing:** Validated endpoint response structures, input boundary conditions, and database fault tolerance using Jest and Supertest.

---

## Resume Highlights

- **Full-Stack Application Development:** Developed and containerized a full-stack application using React, Node.js, Express, and PostgreSQL, implementing RESTful endpoints, connection pooling, and client-side error/loading states.
- **Cloud Architecture & AWS ECS Fargate:** Provisioned and deployed containerized backend services to AWS ECS Fargate behind an Application Load Balancer across multi-AZ private VPC subnets with CloudWatch logging and health checks.
- **Infrastructure as Code (Terraform):** Codified modular cloud infrastructure using Terraform to provision VPC networking, public/private/database subnets, security groups, RDS PostgreSQL, ECR, ECS, IAM roles, and Secrets Manager.
- **Automated CI/CD with AWS OIDC:** Built a GitHub Actions CI/CD pipeline using AWS OIDC for keyless authentication, running automated Jest/Supertest tests, building Docker images, pushing to ECR, and orchestrating zero-downtime ECS rolling updates.
