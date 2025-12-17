### Worker install

1. Create virtual environment

```
su - monitorenv_etl
pyenv update
pyenv install 3.13.9
pyenv virtualenv 3.13.9 prefect_worker_venv
pyenv activate prefect_worker_venv
pip install prefect==3.6.4 prefect-docker==0.6.6
```

2. Create worker daemon

- Create daemon script :
```
su - monitorenv_etl
touch /home/monitorenv_etl/prefectworker.sh
chmod +x /home/monitorenv_etl/prefectworker.sh
```

- Copy paste into it :
```
#!/bin/bash
export PREFECT_UI_URL=http://prefect-3.csam.e2.rie.gouv.fr
export PREFECT_API_URL=http://prefect-3.csam.e2.rie.gouv.fr/api
export PREFECT_WORKER_QUERY_SECONDS=5
export PREFECT_WORKER_PREFETCH_SECONDS=50

source /home/monitorenv_etl/.pyenv/versions/3.13.9/envs/prefect_worker_venv/bin/activate && \
prefect worker start --pool monitorenv --type docker --with-healthcheck
```

- Create service file
```
su - monitorenv_etl
touch /home/monitorenv_etl/prefectworker.service 
```
- Copy paste into it :
```
[Unit]
Description=Prefect Worker

[Service]
User=monitorenv_etl
ExecStart=/home/monitorenv_etl/prefectworker.sh
Restart=always
RestartSec=30

[Install]
WantedBy=multi-user.target
```

- Make it available to systemd :

```systemctl link /home/monitorenv_etl/prefectworker.service```

- Enable and start the daemon

```
systemctl daemon-reload
systemctl enable prefectworker.service
systemctl start prefectworker.service
```
