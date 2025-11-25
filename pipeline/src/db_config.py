import sqlalchemy as sa
from dotenv import get_key

from config import DOTENV_PATH

db_env = {
    "fmc": {
        "client": "ORACLE_CLIENT",
        "host": "ORACLE_HOST",
        "port": "ORACLE_PORT",
        "sid": "ORACLE_FMC_SID",
        "usr": "ORACLE_FMC_USER",
        "pwd": "ORACLE_FMC_PASSWORD",
    },
    "monitorenv_remote": {
        "client": "MONITORENV_REMOTE_DB_CLIENT",
        "host": "MONITORENV_REMOTE_DB_HOST",
        "port": "MONITORENV_REMOTE_DB_PORT",
        "sid": "MONITORENV_REMOTE_DB_NAME",
        "usr": "MONITORENV_REMOTE_DB_USER",
        "pwd": "MONITORENV_REMOTE_DB_PWD",
    },
    "monitorfish_local": {
        "client": "MONITORFISH_LOCAL_CLIENT",
        "host": "MONITORFISH_LOCAL_HOST",
        "port": "MONITORFISH_LOCAL_PORT",
        "sid": "MONITORFISH_LOCAL_NAME",
        "usr": "MONITORFISH_LOCAL_USER",
        "pwd": "MONITORFISH_LOCAL_PWD",
    },
    "cacem_local": {
        "client": "CACEM_LOCAL_CLIENT",
        "host": "CACEM_LOCAL_HOST",
        "port": "CACEM_LOCAL_PORT",
        "sid": "CACEM_LOCAL_NAME",
        "usr": "CACEM_LOCAL_USER",
        "pwd": "CACEM_LOCAL_PWD",
    },
}


def make_connection_string(db: str) -> str:
    """Returns the connection string for the designated database.

    Args:
        db (str): Database name. Possible values :
        'ocan', 'fmc', 'monitorenv_remote', 'monistorfish_local'

    Returns:
        str: connection string for selected database.

    Raises:
        ValueError: with credentials for the selected database are not found in
        environment variables.
    """

    try:
        CLIENT = get_key(DOTENV_PATH, db_env[db]["client"])
        HOST = get_key(DOTENV_PATH, db_env[db]["host"])
        PORT = get_key(DOTENV_PATH, db_env[db]["port"])
        SID = get_key(DOTENV_PATH, db_env[db]["sid"])
        USER = get_key(DOTENV_PATH, db_env[db]["usr"])
        PWD = get_key(DOTENV_PATH, db_env[db]["pwd"])
        assert CLIENT
        assert HOST
        assert PORT
        assert SID
        assert USER
        assert PWD
    except KeyError as e:
        raise KeyError(
            "Database connection credentials not found in env file"
        ) from e

    return f"{CLIENT}://{USER}:{PWD}@{HOST}:{PORT}/{SID}"


def create_engine(db: str, **kwargs) -> sa.engine.Engine:
    """Returns sqlalchemy engine for designated database.

    Args:
        db (str): Database name. Possible values :
            'ocan', 'fmc', 'monitorenv_remote', 'monistorfish_local', 'cacem_local'

    Returns:
        sa.engine.Engine: sqlalchemy engine for selected database.
    """
    connection_string = make_connection_string(db)

    engine = sa.create_engine(connection_string, **kwargs)

    return engine
