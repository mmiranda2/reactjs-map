import os
import json
import requests
import uuid
import contextlib
import subprocess
import datetime
import re
from uuid import uuid4
from werkzeug.security import generate_password_hash, check_password_hash
from flask import Blueprint, request, Response, send_file
from models import User
from application import db

auth = Blueprint('auth', __name__)


@auth.route('/test', methods=['GET'])
def test():
    return 'testing true'


@auth.route('/create_user', methods=['POST'])
def create_user():
    body = request.get_json()
    email, password, firstname, lastname = [
        body[datum] for datum in ('email', 'password', 'firstname', 'lastname')
    ]
    session_token = str(uuid4())
    password_hash = generate_password_hash(password)
    this_user = User(email=email, password_hash=password_hash,
                     first_name=firstname, last_name=lastname, session_token=session_token)
    db.session.add(this_user)
    db.session.commit()

    return {'success': True}


@auth.route('/attempt_login', methods=['POST'])
def attempt_login():
    body = request.get_json()
    email, password = [body[datum] for datum in ('email', 'password')]
    this_user = User.query.filter_by(email=email).first()

    if not this_user:
        return {'verified': False}
    if check_password_hash(this_user.password_hash, password):
        session_token = str(uuid4())
        this_user.session_token = session_token
        db.session.commit()
        return {'verified': True}
    else:
        return {'verified': False}


@auth.route('/logout', methods=['POST'])
def logout():
    body = request.get_json()
    email = body['email']
    this_user = User.query.filter_by(email=email).first()
    this_user.session_token = ''
    db.session.commit()

    return { 'success': True }