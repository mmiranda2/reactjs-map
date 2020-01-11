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
from pyserver import app, db

if os.path.exists('./.env') and os.path.isfile('./.env'):
    load_dotenv()

# app = Flask(__name__)
# app.config.from_object(os.environ['FLASK_CONFIG'])
# db = SQLAlchemy(app)
cache = Cache(app)
redis = Redis(host=os.environ['REDIS_HOST'] if 'REDIS_HOST' in os.environ else 'redis', decode_responses=True)

from server.app import *
from server.auth import *
from server.data import *
