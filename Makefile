BACKEND_CONFIGURATION_FOLDER=$(shell pwd)/infra/configurations/backend/
HOST_MIGRATIONS_FOLDER=$(shell pwd)/backend/src/main/resources/db/migration

ifneq (,$(wildcard ./infra/.env))
		include ./infra/.env
		export
endif


# DEV commands

# Frontend
.PHONY: dev-install dev-run-front dev-run-storybook
dev-install:
	cd frontend && npm install

dev-run-front:
	cd frontend && npm start

dev-run-storybook:
	cd frontend && npm run storybook

.PHONY: test-front dev-lint-frontend test-back

dev-lint-frontend:
	cd frontend && npm run test:lint:partial

test-back:
	cd backend && ./mvnw clean && ./mvnw test

test-front:
	cd frontend && npm run test:unit

# Backend
.PHONY: dev-check-config dev-run-back-with-infra dev-run-back dev-run-infra dev-erase-db dev-clean-target-env
dev-check-config:
	docker compose --project-name $(PROJECT_NAME) --project-directory ./infra/docker --env-file='./infra/.env' -f ./infra/docker/docker-compose.dev.yml config

dev-run-back-with-infra: dev-erase-db dev-run-infra dev-clean-target-env dev-run-back

dev-run-back:
	cd backend && ./mvnw spring-boot:run -Dspring-boot.run.arguments="--spring.config.additional-location="$(BACKEND_CONFIGURATION_FOLDER)"" -Dspring-boot.run.profiles="dev"

dev-run-infra:
	@echo "Preparing database"
	docker compose --project-name $(PROJECT_NAME) --project-directory ./infra/docker --env-file='./infra/.env' -f ./infra/docker/docker-compose.yml -f ./infra/docker/docker-compose.dev.yml up -d db geoserver
	@echo "Waiting for TimescaleDB to be ready to accept connections"
	@while [ -z "$$(docker logs $(PROJECT_NAME)-db-1 2>&1 | grep -o "database system is ready to accept connections")" ]; \
	do \
			echo waiting...; \
			sleep 5; \
	done

	@echo "Database Ready for connections!"

dev-erase-db:
	docker compose \
		--project-name $(PROJECT_NAME) \
		--project-directory ./infra/docker \
		--env-file='./infra/.env' \
		-f ./infra/docker/docker-compose.yml \
		-f ./infra/docker/docker-compose.dev.yml \
		down --remove-orphans -v

dev-clean-target-env:
	rm -rf $(shell pwd)/backend/target

.PHONY: test dev-lint-backend
dev-lint-backend:
	cd ./backend && ./mvnw antrun:run@ktlint-format | grep -v \
		-e "Exceeded max line length" \
		-e "Package name must not contain underscore" \
		-e "Wildcard import"

clean: dev-erase-db dev-clean-target-env

test: test-back
	cd frontend && CI=true npm run test:unit

.PHONY: docker-build-app
docker-build-app:
	docker build --no-cache -f infra/docker/app/Dockerfile . -t monitorenv-app:$(VERSION) \
		--build-arg VERSION=$(VERSION) \
		--build-arg ENV_PROFILE=$(ENV_PROFILE) \
		--build-arg GITHUB_SHA=$(GITHUB_SHA) \
		--build-arg SENTRY_URL=$(SENTRY_URL) \
		--build-arg SENTRY_AUTH_TOKEN=$(SENTRY_AUTH_TOKEN) \
		--build-arg SENTRY_ORG=$(SENTRY_ORG) \
		--build-arg SENTRY_PROJECT=$(SENTRY_PROJECT)

# INIT commands
.PHONY: load-sig-data prod-load-sig-data init-geoserver
load-sig-data:
	set -a
	. ./infra/.env
	set +a
	echo ${PROJECT_NAME}
	./infra/init/postgis_insert_layers.sh

prod-load-sig-data:
	set -a
	. ./infra/.env
	set +a
	echo ${PROJECT_NAME}
	docker compose --project-name $(PROJECT_NAME) --project-directory ./infra/docker --env-file='./infra/.env' \
		-f ./infra/docker/docker-compose.yml \
		-f ./infra/docker/docker-compose.prod.yml \
		-f ./infra/docker/docker-compose.override.yml \
		up -d db
	docker compose --project-name $(PROJECT_NAME) --project-directory ./infra/docker --env-file='./infra/.env' \
		-f ./infra/docker/docker-compose.yml \
		-f ./infra/docker/docker-compose.prod.yml \
		-f ./infra/docker/docker-compose.override.yml \
		exec db \
		psql -U $(POSTGRES_USER) -d $(POSTGRES_DB) -f /opt/data/integration.sql
	docker compose --project-name $(PROJECT_NAME) --project-directory ./infra/docker --env-file='./infra/.env' \
		-f ./infra/docker/docker-compose.yml \
		-f ./infra/docker/docker-compose.prod.yml \
		-f ./infra/docker/docker-compose.override.yml \
		exec db \
		psql -U $(POSTGRES_USER) -d $(POSTGRES_DB) -f /opt/data/control_resources_admin_and_units_data.sql

prod-add-metabase-user:
	set -a
	. ./infra/.env
	set +a
	echo ${PROJECT_NAME}
	docker compose --project-name $(PROJECT_NAME) --project-directory ./infra/docker --env-file='./infra/.env' \
		-f ./infra/docker/docker-compose.yml \
		-f ./infra/docker/docker-compose.prod.yml \
		-f ./infra/docker/docker-compose.override.yml \
		up -d db
	docker compose --project-name $(PROJECT_NAME) --project-directory ./infra/docker --env-file='./infra/.env' \
		-f ./infra/docker/docker-compose.yml \
		-f ./infra/docker/docker-compose.prod.yml \
		-f ./infra/docker/docker-compose.override.yml \
		exec db \
		psql -U $(POSTGRES_USER) -d $(POSTGRES_DB) -f /opt/db/db_users_metabase.sql

init-geoserver:
	set -a
	. ./infra/.env
	set +a
	echo ${PROJECT_NAME}
	./infra/init/v0.01_geoserver_init_layers.sh
	./infra/init/v0.02_geoserver_remove_unused_layers.sh

.PHONY: register-pipeline-flows
register-pipeline-flows:
	docker pull ghcr.io/mtes-mct/monitorenv/monitorenv-pipeline:$(MONITORENV_VERSION) && \
	infra/data-pipeline/register-flows.sh

# DATA commands
.PHONY: install-pipeline run-notebook test-pipeline update-python-dependencies
install-pipeline:
	cd datascience && poetry install
run-notebook:
	cd datascience && poetry run jupyter notebook
test-pipeline:
	cd datascience && export TEST_LOCAL=True && poetry run coverage run -m pytest --pdb tests/ && poetry run coverage report && poetry run coverage html
update-python-dependencies:
	cd datascience && poetry export --without-hashes -o requirements.txt && poetry export --without-hashes --with dev -o requirements-dev.txt


# CI commands - app
.PHONY: docker-tag-app docker-push-app run-infra-for-frontend-tests
docker-tag-app:
	docker tag monitorenv-app:$(VERSION) ghcr.io/mtes-mct/monitorenv/monitorenv-app:$(VERSION)
docker-push-app:
	docker push ghcr.io/mtes-mct/monitorenv/monitorenv-app:$(VERSION)
run-infra-for-frontend-tests:
	export MONITORENV_VERSION=$(VERSION) && docker compose -f ./infra/docker/docker-compose.test.yml up -d

# CI commands - pipeline
.PHONY: docker-build-pipeline docker-test-pipeline docker-tag-pipeline docker-push-pipeline
docker-build-pipeline:
	docker build -f "infra/docker/datapipeline/Dockerfile" . -t monitorenv-pipeline:$(VERSION)
docker-test-pipeline:
	docker run --network host -v /var/run/docker.sock:/var/run/docker.sock -u monitorenv-pipeline:$(DOCKER_GROUP) --env-file datascience/.env.test --env HOST_MIGRATIONS_FOLDER=$(HOST_MIGRATIONS_FOLDER) monitorenv-pipeline:$(VERSION) coverage run -m pytest --pdb tests
docker-tag-pipeline:
	docker tag monitorenv-pipeline:$(VERSION) ghcr.io/mtes-mct/monitorenv/monitorenv-pipeline:$(VERSION)
docker-push-pipeline:
	docker push ghcr.io/mtes-mct/monitorenv/monitorenv-pipeline:$(VERSION)

# ENV setup
.PHONY: init-environment check-config
init-environment:
ifeq (,$(wildcard ./infra/.env))
	@echo "Pas de fichier '.env'. Création d'un nouveau fichier."
	@echo "source ~/monitorenv/infra/init/init_env.sh" >> ~/.bashrc
	@cp infra/.env.template infra/.env
else
	@echo "Un fichier .env existe déjà. Editez ou supprimez le fichier existant."
endif
check-config:
	docker compose --project-name $(PROJECT_NAME) --project-directory ./infra/docker --env-file='./infra/.env' -f ./infra/docker/docker-compose.yml -f ./infra/docker/docker-compose.prod.yml config

# RUN commands
.PHONY: restart-app stop-app
restart-app:
	docker compose --project-name $(PROJECT_NAME) --project-directory ./infra/docker --env-file='./infra/.env' -f ./infra/docker/docker-compose.yml -f ./infra/docker/docker-compose.prod.yml up -d --build app --pull always
stop-app:
	docker compose --project-name $(PROJECT_NAME) --project-directory ./infra/docker --env-file='./infra/.env' -f ./infra/docker/docker-compose.yml -f ./infra/docker/docker-compose.prod.yml stop

# MAINTENANCE
.PHONY: remove-unused-docker-images logs-app logs-geoserver logs-db
remove-unused-docker-images:
	docker image prune -a
logs-backend:
	docker container logs -f monitorenv_backend
logs-geoserver:
	docker container logs -f monitorenv_geoserver
logs-db:
	docker container logs -f monitorenv_database

# ALIASES

dev: dev-run-back-with-infra
