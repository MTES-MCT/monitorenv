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
	docker-compose --project-name $(PROJECT_NAME) --project-directory ./infra/docker --env-file='$(INFRA_FOLDER).env' -f ./infra/docker/docker-compose.dev.yml config

.PHONY: run-back-with-infra
run-back-with-infra: erase-db run-infra clean-target-env run-back

.PHONY: run-back
run-back:
	cd backend && ./mvnw spring-boot:run -Dspring-boot.run.arguments="--spring.config.additional-location="$(BACKEND_CONFIGURATION_FOLDER)"" -Dspring-boot.run.profiles="dev"

.PHONY: run-infra
run-infra:
	@echo "Preparing database"
	docker-compose --project-name $(PROJECT_NAME) --project-directory ./infra/docker --env-file='$(INFRA_FOLDER).env' -f ./infra/docker/docker-compose.dev.yml up -d db geoserver
	@echo "Waiting for TimescaleDB to be ready to accept connections"
	@while [ -z "$$(docker logs $(PROJECT_NAME)-db-1 2>&1 | grep -o "database system is ready to accept connections")" ]; \
	do \
			echo waiting...; \
			sleep 5; \
	done
  
	@echo "Database Ready for connections!"

.PHONY: erase-db
erase-db:
	docker-compose --project-name $(PROJECT_NAME) --project-directory ./infra/docker --env-file='$(INFRA_FOLDER).env' -f ./infra/docker/docker-compose.dev.yml down db
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
.PHONY: build-app tag-docker-image push-docker-image run-infra-for-frontend-tests

# used ?
build-app:
	docker build --no-cache -f infra/docker/app/Dockerfile . -t monitorenv-app:$(VERSION) --build-arg VERSION=$(VERSION) --build-arg ENV_PROFILE=$(ENV_PROFILE) --build-arg GITHUB_SHA=$(GITHUB_SHA)
tag-docker-image:
	docker tag monitorenv-app:$(VERSION) docker.pkg.github.com/mtes-mct/monitorenv/monitorenv-app:$(VERSION)
push-docker-image:
	docker push docker.pkg.github.com/mtes-mct/monitorenv/monitorenv-app:$(VERSION)

# CI - TESTS
run-infra-for-frontend-tests:
	export MONITORENV_VERSION=$(VERSION) && docker-compose -f ./infra/docker/docker-compose.test.yml up -d