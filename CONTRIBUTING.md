# Contributing

- [Contributing](#contributing)
  - [Getting Started: Backend \& Frontend](#getting-started-backend--frontend)
    - [Requirements](#requirements)
    - [First Setup](#first-setup)
    - [Local Development](#local-development)
  - [Getting Started: Data Pipeline](#getting-started-data-pipeline)
    - [Requirements](#requirements-1)
    - [First Setup](#first-setup-1)
    - [Local Development](#local-development-1)
      - [Running a test](#running-a-test)
  - [Technical Stack](#technical-stack)
  - [Legacy Instructions](#legacy-instructions)
    - [Technical Stack (Main Components)](#technical-stack-main-components)
    - [Development Environment Setup](#development-environment-setup)
      - [Prerequisites](#prerequisites)
      - [Configuration](#configuration)
        - [Sentry](#sentry)
      - [Frontend](#frontend)
        - [Linting](#linting)
        - [Environment Variables](#environment-variables)
      - [Backend](#backend)

---

## Getting Started: Backend & Frontend

### Requirements

- Debian-based Linux or macOS
- Docker v25 (with Docker Compose v2)
- Java Development Kit (JDK) 19
- Node.js v20 (with npm v10)

### First Setup

```sh
git clone https://github.com/MTES-MCT/monitorenv.git
cd monitorenv
make dev-install
make dev-init-infra-env
```

### Local Development

In a first CLI tab, for the Backend (in project root):

```sh
make dev-run-back-with-infra
```

In a second CLI tab, for the Frontend:

```sh
make dev-run-front
```

## Getting Started: Data Pipeline

### Requirements

- Debian-based Linux or macOS
- Docker v25 (with Docker Compose v2)
- Python 3 (with pyenv and Poetry)

if you have a mac with apple chipset please check the checkbox in docker dashboard
`Allow the default Docker socket to be used (requires password)` in `settings/advanced`

### First Setup

- install pyenv and Poetry (follow online documentation, it changes really often)
- install the correct python version using ```pyenv install <VERSION>``` (use version defined in pipeline/.python-version)
- run ```make install-pipeline```

### Local Development

#### Running a test

For example :
```pytest --pdb tests/ -k test_load_competence_cross_areas -s```

## Technical Stack

- Databases
  - PostgreSQL
  - GeoServer
- Backend
  - Language: Kotlin
  - Framework: Spring
  - ORM: Hibernate
  - Testing: JUnit, Mockito
  - Documentation: Swagger
- Frontend
  - Language: TypeScript
  - Framework: React (with Vite)
  - UI: Rsuite (mostly customized via [monitor-ui](https://github.com/MTES-MCT/monitor-ui))
  - Testing: Jest, Cypress, Puppeteer
- Data Pipeline
  - Language: Python (with Poetry)
  - Workflow: Prefect
  - Testing: Pytest

---

---

## Legacy Instructions

> [!IMPORTANT]  
> These instructions must be cleaned, updated and clarified. They are kept here in the meantime.

### Technical Stack (Main Components)

- Infrastructure:
  - Docker
- Backend:
  - Kotlin
  - Spring
- PostgreSQL
- Geoserver
- Frontend:
  - React (Vite)
  - OpenLayers
  - Rsuite
- Data pipeline:
  - Python 3
  - Poetry
  - Prefect

### Development Environment Setup

#### Prerequisites

- npm
- openjdk (osx: `brew install openjdk`)
- postgres (only `psql` is required. osx: `brew install libpq`)
- docker + docker-compose
- python 3 + poetry

#### Configuration

Optionally create and modify `./.env.local`

##### Sentry

SENTRY_DSN is an environment variable used by Sentry to identify the application. It is used by both the frontend and
backend. It is defined in the `.env` file and injected into the frontend application via the `./public/env.js` file.

If `SENTRY_DSN` is set, the backend logs will automatically be sent.

#### Frontend

`make dev-install`: install frontend dependencies
`make dev-run-front`: starts the frontend development server
The browser will automatically open at the URL <http://localhost:3000>

##### Linting

Before pushing a commit, check the linting with `npm run test:lint`

##### Environment Variables

Variable injection is done with `import-meta-env`.

Environment variables are injected in the frontend on runtime.
`.env.frontend.example` filters the environment variables that are injected in the frontend.

The same system is used to generate a `.env` file for the backend in development mode.
Command `make dev-init-infra-env` generates a `.env` file which is exported for each make command.

#### Backend

Start the backend:
`make dev-run-back-with-infra`:

- optionally removes previous docker instances
- creates a docker instance of the database + geoserver
- launches the development backend server

The backend is then accessible at <http://localhost:8880> by default.
A Swagger interface is available at the URL: <http://localhost:8880/swagger-ui.html>

It may be necessary to load context data for frontend development and configure Geoserver to distribute this data.

To restart the backend without recreating the database and geoserver containers, run the command `make dev-run-back`
