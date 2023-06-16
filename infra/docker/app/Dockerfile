
#####################
# Multi stage build #
#####################

ARG GITHUB_SHA=NO_COMMIT
ARG VERSION=NO_VERSION

########################################
# Build monitorenv backend with maven #
########################################
FROM maven:3.8.5-openjdk-17-slim as buildBack

ARG GITHUB_SHA
ARG VERSION

WORKDIR /tmp/
COPY backend/pom.xml /tmp/pom.xml
RUN mvn dependency:go-offline -B

COPY backend/ /tmp/
COPY backend/pom.xml /tmp/POM_WITH_ENV_VARS
RUN sed -e 's/COMMIT_TO_CHANGE/${GITHUB_SHA}/' \
  -e 's/VERSION_TO_CHANGE/${VERSION}/' \
  POM_WITH_ENV_VARS > pom.xml

RUN mvn clean package -DskipTests=true

###########################
# Build frontend with npm #
###########################
FROM node:18-alpine as buildFront

ENV DEBIAN_FRONTEND=noninteractive
ENV DISABLE_ESLINT_PLUGIN=true

ARG ENV_PROFILE
ENV REACT_APP_ENV $ENV_PROFILE

RUN echo ${REACT_APP_ENV}

COPY frontend/ /tmp/frontend/
COPY infra/ /tmp/infra/
WORKDIR /tmp/frontend

# Files are expected to be in /tmp/frontend/dist/monitorenv-frontend
RUN npm ci
RUN npm run build

######################
# Create final image #
######################
# There is no more JRE with Java 11 : https://stackoverflow.com/a/53733414
FROM azul/zulu-openjdk-alpine:17.0.7-jre-headless

ARG VERSION
ENV VERSION $VERSION

ARG ENV_PROFILE
ENV ENV_PROFILE $ENV_PROFILE

ENV REACT_APP_ENV $ENV_PROFILE
ENV ENV_DB_URL=

# Add bash
RUN apk add --no-cache bash

RUN adduser -D monitorenv
USER monitorenv

EXPOSE 8880
EXPOSE 5000
EXPOSE 5001
WORKDIR /home/monitorenv

ENV JAVA_TOOL_OPTIONS "-Dcom.sun.management.jmxremote.ssl=false \
  -Dcom.sun.management.jmxremote.authenticate=false \
  -Dcom.sun.management.jmxremote.port=5000 \
  -Dcom.sun.management.jmxremote.rmi.port=5001 \
  -Dcom.sun.management.jmxremote.registry.ssl=false \
  -Dcom.sun.management.jmxremote.host=0.0.0.0 \
  -Djava.rmi.server.hostname=0.0.0.0"

# Copy files for the back
COPY --from=buildBack /tmp/target/monitorenv-${VERSION}.jar /home/monitorenv
COPY infra/configurations/backend /home/monitorenv/configurations/

USER monitorenv
# Copy files for the front
RUN mkdir /home/monitorenv/public
COPY --from=buildFront /tmp/frontend/build /home/monitorenv/public/
COPY --from=buildFront /tmp/infra/docker/app/env.sh /home/monitorenv/

# Add logs folder to be mounted as volume
RUN mkdir /home/monitorenv/logs

# Set up environement variable that define the root folder use for serving static files
# It must point to the front (React) files
ENV STATIC_FILES_PATH /home/monitorenv/public

# Default profile is for local. Can be overiden at start : docker run -e "SPRING_PROFILES_ACTIVE=prod"
ENV SPRING_PROFILES_ACTIVE ${ENV_PROFILE}

RUN echo ${ENV_PROFILE}

USER root
RUN chown monitorenv /home/monitorenv/env.sh
RUN chmod +x /home/monitorenv/env.sh
USER monitorenv

ENTRYPOINT ["/home/monitorenv/env.sh"]

CMD exec java -Dspring.config.additional-location="/home/monitorenv/configurations/" -jar "monitorenv-${VERSION}.jar"
