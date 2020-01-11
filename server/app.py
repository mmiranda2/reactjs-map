import os
from flask import Flask, request, Response, render_template, redirect
from flask_sqlalchemy import SQLAlchemy
from .auth import auth
from .data import data
import requests, json, subprocess, datetime
from flask_caching import Cache
from dotenv import load_dotenv
from models import User
from application import app, db, cache, redis

app.register_blueprint(auth, url_prefix='/api/auth')
app.register_blueprint(data, url_prefix='/api/data')

@app.route('/api', methods=['GET'])
def index():
    print('hi')
    return 'hello world'

@app.errorhandler(404)
def not_found(error):
    print(error)
    return redirect('/')

@app.errorhandler(500)
def server_error(error):
    return repr(error)
