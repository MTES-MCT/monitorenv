FROM python:3.10.12-slim-bullseye

ENV TINI_VERSION=v0.19.0
ENV USER="monitorenv-pipeline"
ENV VIRTUAL_ENV=/opt/venv

# Add `tini` init
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini

# Create non root user
RUN useradd -m -r ${USER} && \
    chown ${USER} /home/${USER}
WORKDIR /home/${USER}

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libpq-dev \
    build-essential \
    alien \
    libaio1 \
    wget \
    && rm -rf /var/lib/apt/lists/*

# # Download and install Oracle Instant Client
RUN wget \
    https://download.oracle.com/otn_software/linux/instantclient/19800/oracle-instantclient19.8-basic-19.8.0.0.0-1.x86_64.rpm \
    && alien --scripts oracle-instantclient19.8-basic-19.8.0.0.0-1.x86_64.rpm \
    && dpkg -i oracle-instantclient19.8-basic_19.8.0.0.0-2_amd64.deb \
    && rm oracle-instantclient19.8-basic-19.8.0.0.0-1.x86_64.rpm \
    && rm oracle-instantclient19.8-basic_19.8.0.0.0-2_amd64.deb

# Create and "activate" venv by prepending it to PATH then install python dependencies
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# Install python dependencies
COPY datascience/requirements.txt /tmp/requirements.txt
RUN python3 -m venv $VIRTUAL_ENV && \
    pip install -U \
    pip \
    setuptools \
    wheel && \
    pip install -r /tmp/requirements.txt

# Make library importable
ENV PYTHONPATH=/home/${USER}

# Add source
COPY datascience/ ./datascience
RUN pip install -e ./datascience
COPY backend/src/main/resources/db/migration  ./backend/src/main/resources/db/migration
RUN mkdir /home/${USER}/.prefect/

RUN chown -R ${USER} .
USER ${USER}
WORKDIR /home/${USER}/datascience
ENTRYPOINT ["/tini", "--"]
CMD ["python", "main.py"]
