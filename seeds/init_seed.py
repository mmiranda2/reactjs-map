from pyserver import db
from sqlalchemy import Sequence
from sqlalchemy.dialects import postgresql as psql
import datetime
from models import User, GeoJSON
import json

def run():
    p_hash = 'pbkdf2:sha256:150000$WZue2jad$8c3440a416558066e777c0525da95dccb4990436306572452cdccedcd6676d26'
    a = User(email='mmiranda2@wisc.edu', first_name='Michael', last_name='Miranda', session_token='', password_hash=p_hash)

    with open('./server/data/markers.json', 'rb') as f:
        p = json.load(f)
    g = GeoJSON(user_id=1, name='example points', uuid='1234', geojson=p)

    db.session.add(a)
    db.session.add(g)
    db.session.commit()
    return