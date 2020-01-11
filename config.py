import os

psql_str = f'postgresql://{os.environ["DB_USER"]}:{os.environ["DB_PASS"]}@{os.environ["DB_HOST"]}:{os.environ["DB_PORT"]}/{os.environ["DB_NAME"]}'
# TODO: if shit exists: psql_str += shit
pgssl = os.environ["PGSSLROOTCERT"] if 'PGSSLROOTCERT' in os.environ else None
class Config:
    DEBUG = True
    CACHE_TYPE = "simple"
    CACHE_DEFAULT_TIMEOUT = 0
    SQLALCHEMY_DATABASE_URI = psql_str
    SQLALCHEMY_TRACK_MODIFICATIONS = False

class Development(Config):
    DEVELOPMENT=True

class Production(Config):
    STATIC_FOLDER = 'static'
    TEMPLATE_FOLDER = 'templates'
    STATIC_URL_PATH = ''
    # SQLALCHEMY_ENGINE_OPTIONS = {
    #     'ssl': {
    #         'ca': pgssl
    #     }
    # }
