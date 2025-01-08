#####################
# Multi stage build #
#####################

ARG GITHUB_SHA=NO_COMMIT
ARG VERSION=NO_VERSION

########################################
# Build monitorenv backend with maven #
########################################
FROM gradle:8.4-jdk17 as buildBack

ARG GITHUB_SHA
ARG VERSION

WORKDIR /tmp/

COPY --chown=gradle:gradle backend/ /tmp/
COPY --chown=gradle:gradle backend/build.gradle.kts /tmp/BUILD_GRADLE_WITH_ENV_VARS
RUN chown -R gradle /tmp/*

USER gradle
RUN sed -e "s/COMMIT_TO_CHANGE/$GITHUB_SHA/g" \
  -e "s/VERSION_TO_CHANGE/${VERSION}/g" \
  BUILD_GRADLE_WITH_ENV_VARS > build.gradle.kts

RUN gradle assemble

###########################
# Build frontend with npm #
###########################
FROM node:20-alpine as buildFront

ENV DEBIAN_FRONTEND=noninteractive
ENV DISABLE_ESLINT_PLUGIN=true
ENV PUPPETEER_SKIP_DOWNLOAD=true

ARG VERSION
ARG ENV_PROFILE

COPY frontend/ /tmp/frontend/
COPY infra/docker/app/env.sh /tmp/infra/docker/app/env.sh
WORKDIR /tmp/frontend

# Files are expected to be in /tmp/frontend/build
RUN npm ci
RUN npm run build

# Create an `import-meta-env` Alpine executable without node, to be copied to the final image
RUN npx pkg ./node_modules/@import-meta-env/cli/bin/import-meta-env.js \
  --target node16-alpine-x64 \
  --output import-meta-env

######################
# Create final image #
######################
FROM azul/zulu-openjdk-alpine:17-jre

ARG VERSION
ENV VERSION=$VERSION

ARG ENV_PROFILE
ENV ENV_PROFILE=$ENV_PROFILE

ENV ENV_DB_URL=""

# Add bash
RUN apk add --no-cache bash

RUN adduser -D monitorenv
USER monitorenv

EXPOSE 8880
EXPOSE 5000
EXPOSE 5001
WORKDIR /home/monitorenv

ENV JAVA_TOOL_OPTIONS="-Dcom.sun.management.jmxremote.ssl=false \
  -Dcom.sun.management.jmxremote.authenticate=false \
  -Dcom.sun.management.jmxremote.port=5000 \
  -Dcom.sun.management.jmxremote.rmi.port=5001 \
  -Dcom.sun.management.jmxremote.registry.ssl=false \
  -Dcom.sun.management.jmxremote.host=0.0.0.0 \
  -Djava.rmi.server.hostname=0.0.0.0"

# Copy files for the back
COPY --from=buildBack /tmp/build/libs/monitorenv-${VERSION}.jar /home/monitorenv

USER monitorenv

# Copy files for the front
RUN mkdir /home/monitorenv/public
COPY --from=buildFront /tmp/frontend/build /home/monitorenv/public/

# Copy import-meta-env
COPY --from=buildFront /tmp/frontend/import-meta-env /home/monitorenv/
COPY --from=buildFront /tmp/infra/docker/app/env.sh /home/monitorenv/
COPY --from=buildFront /tmp/frontend/.env.frontend.example /home/monitorenv/

# Add logs folder to be mounted as volume
RUN mkdir /home/monitorenv/logs

# Set up environement variable that define the root folder use for serving static files
# It must point to the front (React) files
ENV STATIC_FILES_PATH=/home/monitorenv/public

# Default profile is for local. Can be overiden at start : docker run -e "SPRING_PROFILES_ACTIVE=prod"
ENV SPRING_PROFILES_ACTIVE=${ENV_PROFILE}

RUN echo ${ENV_PROFILE}

USER root

RUN chown monitorenv /home/monitorenv/import-meta-env
RUN chmod +x /home/monitorenv/import-meta-env
RUN chown monitorenv /home/monitorenv/env.sh
RUN chmod +x /home/monitorenv/env.sh
RUN chown monitorenv /home/monitorenv/import-meta-env
RUN chmod +x /home/monitorenv/import-meta-env
RUN chown monitorenv /home/monitorenv/public/index.html
RUN chmod +rwx /home/monitorenv/public/index.html

USER monitorenv

ENTRYPOINT ["/home/monitorenv/env.sh"]

CMD exec java -Dhttp.proxyHost=${MONITORENV_HTTP_PROXY_HOST} -Dhttp.proxyPort=${MONITORENV_HTTP_PROXY_PORT} \
              -Dhttps.proxyHost=${MONITORENV_HTTP_PROXY_HOST} -Dhttps.proxyPort=${MONITORENV_HTTP_PROXY_PORT} \
              -Dhttp.nonProxyHosts=${MONITORENV_HTTP_PROXY_PORT} -Dhttps.nonProxyHosts=${MONITORENV_HTTP_PROXY_PORT} \
              -Dspring.config.additional-location="/home/monitorenv/configurations/" \
              -jar "monitorenv-${VERSION}.jar"
