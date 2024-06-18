BACKEND_CONFIGURATION_FOLDER=$(shell pwd)/infra/configurations/backend/
HOST_MIGRATIONS_FOLDER=$(shell pwd)/backend/src/main/resources/db/migration

ifneq (,$(wildcard ./.env))
		include ./.env
		export
endif


# DEV commands

# Frontend
.PHONY: dev-install dev-run-front dev-init-infra-env 
dev-init-infra-env:
	./frontend/node_modules/.bin/import-meta-env-prepare -u -x ./.env.infra.example -p ./.env.dev.defaults

dev-install:
	cd frontend && npm install

dev-run-front:
	cd frontend && npm run dev

.PHONY: test-front dev-lint-frontend test-back

dev-lint-frontend:
	cd frontend && npm run test:lint

test-back: check-clean-archi
	cd backend && ./gradlew clean test

test-front:
	cd frontend && npm run test:unit

# Backend
.PHONY: dev-run-back-with-infra dev-run-back  dev-run-keycloak dev-run-infra dev-erase-db dev-clean-build-env

dev-run-back-with-infra: dev-erase-db dev-run-keycloak dev-run-infra dev-clean-build-env dev-run-back

dev-run-back-debug-with-infra: dev-erase-db dev-run-infra dev-clean-target-env dev-run-back-debug


dev-run-back:
	cd backend && ./gradlew bootRun

dev-run-back-debug:
	cd backend && ./gradlew bootRun --debug-jvm --args='--spring.profiles.active=dev --spring.config.additional-location=$(BACKEND_CONFIGURATION_FOLDER)'
dev-run-keycloak:
	docker compose up -d keycloak

dev-run-infra:
	@echo "Preparing database"
	docker compose up -d db
	@echo "Waiting for TimescaleDB to be ready to accept connections"
	@while [ -z "$$(docker logs monitorenv_database 2>&1 | grep -o "database system is ready to accept connections")" ]; \
	do \
			echo waiting...; \
			sleep 5; \
	done

	@echo "Database Ready for connections!"
	docker compose up -d geoserver mock-monitorfish mock-rapportnav

dev-dump-db:
	sh ./infra/scripts/backup_dev_db.sh

dev-restore-db:
	sh ./infra/scripts/restore_dev_db.sh

dev-erase-db:
	docker compose down --remove-orphans -v

dev-clean-build-env:
	rm -rf $(shell pwd)/backend/build

.PHONY: clean lint-back test check-clean-archi
check-clean-archi:
	cd backend/tools && ./check-clean-architecture.sh

lint-back:
	cd ./backend && ./gradlew ktlintFormat | grep -v \
		-e "Exceeded max line length" \
		-e "Package name must not contain underscore" \
		-e "Wildcard import"

clean: dev-erase-db dev-clean-build-env

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

init-geoserver:
	set -a
	. ./infra/.env
	set +a
	echo ${PROJECT_NAME}
	./infra/init/geoserver_init_layers.sh

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
.PHONY: docker-tag-app docker-push-app test-run-infra-for-frontend test-init-infra-env
docker-tag-app:
	docker tag monitorenv-app:$(VERSION) ghcr.io/mtes-mct/monitorenv/monitorenv-app:$(VERSION)
docker-push-app:
	docker push ghcr.io/mtes-mct/monitorenv/monitorenv-app:$(VERSION)
test-init-infra-env:
	npm i @import-meta-env/prepare@0.1.13 && npx import-meta-env-prepare -u -x ./.env.infra.example -p ./.env.test.defaults
test-run-infra-for-frontend:
	export MONITORENV_VERSION=$(VERSION) && docker compose --profile=test up -d
test: test-back
	cd frontend && CI=true npm run test:unit

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
.PHONY: init-environment
init-environment:
ifeq (,$(wildcard ./infra/.env))
	@echo "Pas de fichier '.env'. Création d'un nouveau fichier."
	@echo "source ~/monitorenv/infra/init/init_env.sh" >> ~/.bashrc
	@cp infra/.env.template infra/.env
else
	@echo "Un fichier .env existe déjà. Editez ou supprimez le fichier existant."
endif

# RUN commands
.PHONY: restart-app stop-app
restart-app:
	docker compose up -d --build app db geoserver --pull always

# ALIASES

.PHONY: dev lint-back

dev: dev-run-back
