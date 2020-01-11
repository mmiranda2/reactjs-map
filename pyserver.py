import os
from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from flask_caching import Cache
import requests
import json
import subprocess
import datetime
from dotenv import load_dotenv
from redis import Redis
from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand

if os.path.exists('./.env') and os.path.isfile('./.env'):
    load_dotenv()
app = Flask(__name__, static_url_path='', static_folder='server/data')
app.config.from_object(os.environ['FLASK_CONFIG'])
db = SQLAlchemy(app)

if __name__ == "__main__":
    #subprocess.run(['npm', 'run', 'build'])
    subprocess.Popen(['npm', 'start'])

    app.run(debug=True, use_reloader=False, port=os.environ['FLASK_PORT'])
