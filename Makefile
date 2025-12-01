BACKEND_CONFIGURATION_FOLDER=$(shell pwd)/infra/configurations/backend/
HOST_MIGRATIONS_FOLDER=$(shell pwd)/backend/src/main/resources/db/migration
PIPELINE_TEST_ENV_FILE=$(shell pwd)/pipeline/.env.test

ifneq (,$(wildcard .env))
		include .env
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

dev-run-back-debug-with-infra: dev-erase-db dev-run-keycloak dev-run-infra dev-clean-build-env dev-run-back-debug

dev-run-back-with-infra-unsecured: dev-erase-db dev-run-infra dev-clean-build-env dev-run-back-unsecured


dev-run-back:
	cd backend && ./gradlew bootRun

dev-run-back-debug:
	cd backend && ./gradlew bootRun --debug-jvm --args='logging.root.level=DEBUG'

dev-run-back-unsecured:
	cd backend && ./gradlew bootRun --args='monitorenv.oidc.enabled=false'

dev-run-keycloak:
	docker compose up -d keycloak

dev-run-infra:
	@echo "Preparing database"
	docker compose -f docker-compose.yml -f docker-compose-test.yml up -d db
	@echo "Waiting for TimescaleDB to be ready to accept connections"
	@while [ -z "$$(docker logs monitorenv_database 2>&1 | grep -o "database system is ready to accept connections")" ]; \
	do \
			echo waiting...; \
			sleep 5; \
	done

	@echo "Database Ready for connections!"
	docker compose --profile dev up -d

dev-dump-db:
	sh ./infra/scripts/backup_dev_db.sh

dev-restore-db:
	sh ./infra/scripts/restore_dev_db.sh

dev-erase-db:
	docker compose -p monitorenv down --remove-orphans -v

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
.PHONY: load-sig-data init-geoserver
load-sig-data:
	./infra/init/postgis_insert_layers.sh

init-geoserver:
	./infra/init/geoserver_init_layers.sh

# DATA commands
.PHONY: install-pipeline run-notebook test-pipeline update-python-dependencies
install-pipeline:
	cd datascience && poetry install
run-notebook:
	cd datascience && poetry run jupyter notebook
test-pipeline:
	cd datascience && export TEST_LOCAL=True && poetry run coverage run -m pytest --pdb tests/ && poetry run coverage report && poetry run coverage html
test-pipeline-prefect3:
	cd pipeline && export TEST=True && poetry run coverage run -m pytest -s --pdb tests/ && poetry run coverage report && poetry run coverage html

# CI commands - app
.PHONY: docker-tag-app docker-push-app test-run-infra-for-frontend test-init-infra-env
docker-tag-app:
	docker tag monitorenv-app:$(VERSION) ghcr.io/mtes-mct/monitorenv/monitorenv-app:$(VERSION)
docker-push-app:
	docker push ghcr.io/mtes-mct/monitorenv/monitorenv-app:$(VERSION)
test-init-infra-env:
	npm i @import-meta-env/prepare@0.1.13 && npx import-meta-env-prepare -u -x ./.env.infra.example -p ./.env.test.defaults
test-run-infra-for-frontend:
	export MONITORENV_VERSION=$(VERSION) && docker compose --profile=test -f docker-compose.yml -f docker-compose-test.yml up -d
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

.PHONY: docker-build-pipeline-prefect3 docker-test-pipeline-prefect3 docker-tag-pipeline-prefect3 docker-push-pipeline-prefect3
docker-build-pipeline-prefect3:
	docker build -f "infra/docker/datapipeline/prefect3.Dockerfile" . -t monitorenv-pipeline-prefect3:$(VERSION)
docker-test-pipeline-prefect3:
	docker run \
		--network host \
		-e HOST_MIGRATIONS_FOLDER=$(HOST_MIGRATIONS_FOLDER) \
		-e TEST=True \
		-v $(PIPELINE_TEST_ENV_FILE):/home/monitorenv-pipeline/pipeline/.env.test \
		-v /var/run/docker.sock:/var/run/docker.sock \
		-u monitorenv-pipeline:$(DOCKER_GROUP) \
		monitorenv-pipeline-prefect3:$(VERSION) \
		coverage run -m pytest --pdb tests
docker-tag-pipeline-prefect3:
	docker tag monitorenv-pipeline-prefect3:$(VERSION) ghcr.io/mtes-mct/monitorenv/monitorenv-pipeline-prefect3:$(VERSION)
docker-push-pipeline-prefect3:
	docker push ghcr.io/mtes-mct/monitorenv/monitorenv-pipeline-prefect3:$(VERSION)

# ENV setup
.PHONY: init-environment
init-environment:
ifeq (,$(wildcard .env))
	@echo "Pas de fichier '.env'. Création d'un nouveau fichier."
	@echo "source ~/monitorenv/infra/init/init_env.sh" >> ~/.bashrc
	@cp .env.infra.example .env
else
	@echo "Un fichier .env existe déjà. Editez ou supprimez le fichier existant."
endif

# RUN commands
.PHONY: restart-app
restart-app:
	docker compose --profile production up -d --build --pull always

.PHONY: register-pipeline-flows
register-pipeline-flows:
	docker pull ghcr.io/mtes-mct/monitorenv/monitorenv-pipeline:$(MONITORENV_VERSION) && \
	infra/data-pipeline/register-flows.sh

.PHONY: deploy-pipeline-flows
deploy-pipeline-flows:
	docker pull ghcr.io/mtes-mct/monitorenv/monitorenv-pipeline-prefect3:$(MONITORENV_VERSION) && \
	infra/data-pipeline-prefect3/deploy-flows.sh


################################################################################
# Database upgrade

print_pg_conf_files:
	docker run --rm -i \
		-v $(DB_DATA_VOLUME_NAME):/var/lib/postgresql/data \
		debian:buster \
		bash < infra/database_upgrade/print_pg_conf_files.sh;

check-database-extensions-versions:
	docker exec -i monitorenv_database bash < infra/database_upgrade/check_extensions_versions.sh

update-database-extensions:
	docker exec -i monitorenv_database bash < infra/database_upgrade/update_postgis.sh

upgrade-postgres-11-to-15:
	docker run --rm \
		-v $(PG_11_DATA_VOLUME_NAME):/var/lib/postgresql/11/data \
		-v $(PG_15_DATA_VOLUME_NAME):/var/lib/postgresql/15/data \
		ghcr.io/mtes-mct/monitorenv/monitorenv-database-upgrade:pg11_to_pg15-postgis3.3.2;

upgrade-postgres-15-to-17:
	docker run --rm \
		-v $(PG_15_DATA_VOLUME_NAME):/var/lib/postgresql/15/data \
		-v $(PG_17_DATA_VOLUME_NAME):/var/lib/postgresql/17/data \
		ghcr.io/mtes-mct/monitorenv/monitorenv-database-upgrade:pg15_to_pg17-postgis3.5.1;

fix_pg_hba:
	docker run --rm \
		-v $(DB_DATA_VOLUME_NAME):/var/lib/postgresql/data \
		debian:buster \
		bash -c 'echo "host all all all md5" >> /var/lib/postgresql/data/pg_hba.conf';


# ALIASES
.PHONY: dev

dev: dev-run-back
