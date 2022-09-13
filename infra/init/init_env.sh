#!/bin/sh
cat << EOT
            ###########################           
           ##                        ###          
         ###                           ##          MONITORENV VERSION                : $MONITORENV_VERSION
        ###     ###################     ###       
      ###     ###                 ##      ##       MONITORENV_LOGS_FOLDER_BACKEND    : $MONITORENV_LOGS_FOLDER_BACKEND
     ###     ###                   ###     ###     MONITORENV_BACKUPS_FOLDER : $MONITORENV_BACKUPS_FOLDER
    ##      ##          ###          ##      ##    MONITORENV_LOGS_AND_BACKUPS_GID : $MONITORENV_LOGS_AND_BACKUPS_GID
  ###     ###        ###   ###        ###     ### 
 ##      ##         ##      ##         ###     ### POSTGRES_DB       : $POSTGRES_DB
                     ###   ###        ##      ##   POSTGRES_USER     : $POSTGRES_USER
            %%          ##          ###     ###    POSTGRES_PASSWORD : ***SECRET***
        %%%%  %%%       ##         ###     ###    
        %%      %%      ##       ###      ##      
        %%%   %%%       ###########     ###       
           %%%          ##             ##         commandes principales:
      %%    %%          ##           ###            Run : make restart-app
      %%%%%%%%          ##############              Logs: make logs-backend / make logs-geoserver / make logs-db
EOT