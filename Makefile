INFRA_FOLDER=$(shell pwd)/infra/
BACKEND_CONFIGURATION_FOLDER=$(shell pwd)/infra/configurations/backend/

ifneq (,$(wildcard ./infra/.env))
		include ./infra/.env
		export
endif


# DEV commands
.PHONY: install 
install:
	cd frontend && npm install

.PHONY: run-front-dev
run-front-dev:
	cd frontend && npm start

.PHONY: back-config
back-config:
	docker compose --project-name $(PROJECT_NAME) --project-directory ./infra/docker --env-file='$(INFRA_FOLDER).env' -f ./infra/docker/docker-compose.dev.yml config

.PHONY: run-back-with-infra
run-back-with-infra: erase-db run-infra clean-target-env run-back

.PHONY: run-back
run-back:
	cd backend && ./mvnw spring-boot:run -Dspring-boot.run.arguments="--spring.config.additional-location="$(BACKEND_CONFIGURATION_FOLDER)"" -Dspring-boot.run.profiles="dev"

.PHONY: run-infra
run-infra:
	@echo "Preparing database"
	docker compose --project-name $(PROJECT_NAME) --project-directory ./infra/docker --env-file='$(INFRA_FOLDER).env' -f ./infra/docker/docker-compose.yml -f ./infra/docker/docker-compose.dev.yml up -d db geoserver
	@echo "Waiting for TimescaleDB to be ready to accept connections"
	@while [ -z "$$(docker logs $(PROJECT_NAME)-db-1 2>&1 | grep -o "database system is ready to accept connections")" ]; \
	do \
			echo waiting...; \
			sleep 5; \
	done
  
	@echo "Database Ready for connections!"

.PHONY: erase-db
erase-db:
	docker compose --project-name $(PROJECT_NAME) --project-directory ./infra/docker --env-file='$(INFRA_FOLDER).env' -f ./infra/docker/docker-compose.dev.yml down db
	docker volume rm -f $(PROJECT_NAME)_db-data

.PHONY: clean-target-env
clean-target-env:
	rm -rf $(shell pwd)/backend/target

test:
	cd backend && ./mvnw clean && ./mvnw test
	cd frontend && CI=true npm test
test-front:
	cd frontend && npm test

# INIT commands
.PHONY: load-sig-data
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



# DATA commands
.PHONY: install-data-pipelines
install-data-pipelines:
	cd datascience && poetry install
.PHONY: run-notebook
run-notebook:
	cd datascience && poetry run jupyter notebook


# CI commands - app
.PHONY: build-app docker-tag-app docker-push-app run-infra-for-frontend-tests
build-app:
	docker build --no-cache -f infra/docker/app/Dockerfile . -t monitorenv-app:$(VERSION) --build-arg VERSION=$(VERSION) --build-arg ENV_PROFILE=$(ENV_PROFILE) --build-arg GITHUB_SHA=$(GITHUB_SHA)
docker-tag-app:
	docker tag monitorenv-app:$(VERSION) ghcr.io/mtes-mct/monitorenv/monitorenv-app:$(VERSION)
docker-push-app:
	docker push ghcr.io/mtes-mct/monitorenv/monitorenv-app:$(VERSION)

## CI - TESTS
run-infra-for-frontend-tests:
	export MONITORENV_VERSION=$(VERSION) && docker compose -f ./infra/docker/docker-compose.test.yml up -d

# CI commands - pipeline
.PHONY: docker-build-pipeline docker-test-pipeline docker-tag-pipeline docker-push-pipeline
docker-build-pipeline:
	docker build -f "infra/docker/datapipeline/Dockerfile" . -t monitorenv-pipeline:$(VERSION)
docker-test-pipeline:
	docker run --network host -v /var/run/docker.sock:/var/run/docker.sock -u monitorenv-pipeline:$(DOCKER_GROUP) --env-file datascience/.env.test monitorenv-pipeline:$(VERSION) coverage run -m pytest --pdb tests
docker-tag-pipeline:
	docker tag monitorenv-pipeline:$(VERSION) ghcr.io/mtes-mct/monitorenv/monitorenv-pipeline:$(VERSION)
docker-push-pipeline:
	docker push ghcr.io/mtes-mct/monitorenv/monitorenv-pipeline:$(VERSION)

# ENV setup
create-env-file:
	cp infra/.env.template infra/.env
check-config:
	docker compose --project-name $(PROJECT_NAME) --project-directory $(INFRA_FOLDER)/docker --env-file='$(INFRA_FOLDER).env' -f ./infra/docker/docker-compose.yml -f ./infra/docker/docker-compose.prod.yml config
# RUN commands
restart-app:
	docker compose --project-name $(PROJECT_NAME) --project-directory $(INFRA_FOLDER)/docker --env-file='$(INFRA_FOLDER).env' -f ./infra/docker/docker-compose.yml -f ./infra/docker/docker-compose.prod.yml up -d

# MAINTENANCE
remove-unused-docker-images:
	docker image prune -a