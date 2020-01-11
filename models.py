# coding: utf-8
from sqlalchemy import Sequence, ARRAY, BigInteger, Boolean, Column, DateTime, INTEGER, Float, ForeignKey, Integer, JSON, LargeBinary, String, Text, VARCHAR
from sqlalchemy.dialects import postgresql as psql
from sqlalchemy.schema import FetchedValue
from sqlalchemy.orm import relationship
from flask_sqlalchemy import SQLAlchemy
from flask import Flask
import json
import datetime
from sqlalchemy.orm.collections import InstrumentedList
import copy

from pyserver import db

class BaseModel(db.Model):
    __abstract__ = True

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def remove(self):
        db.session.delete(self)
        db.session.commit()

    def remove_relations(self):
        for key, val in self.__dict__.items():
            if type(val) is InstrumentedList:
                for sub_val in val:
                    db.session.delete(sub_val)
            if issubclass(type(val), BaseModel):
                db.session.delete(val)
        db.session.commit()

    def to_str(self):
        return json.dumps(self.to_dict())

    def to_dict(self, ignore=None):
        r = copy.deepcopy(self.__dict__)

        if '_sa_instance_state' in r:
            r.pop('_sa_instance_state')

        for key, val in r.items():
            if type(val) is datetime.datetime:
                r[key] = str(val)
            if type(val) is InstrumentedList:
                r[key] = [ sub_val.to_dict() for sub_val in val ]
            if issubclass(type(val), BaseModel):
                r[key] = val.to_dict()

        return r

class User(BaseModel):
    __tablename__ = 'Users'
    field_seq = Sequence(f'{__tablename__}_id_seq')

    id = db.Column(db.Integer, field_seq, primary_key=True, server_default=field_seq.next_value())
    email = db.Column(db.String(255), nullable=False, unique=True)
    password_hash = db.Column(db.String(128), nullable=True)
    first_name = db.Column(db.String(255), nullable=True, unique=False)
    last_name = db.Column(db.String(255), nullable=True, unique=False)
    polys = db.Column(psql.JSONB)
    session_token = db.Column(db.String(255), nullable=True, unique=True)
    createdAt = db.Column(db.DateTime(True), nullable=False, default=datetime.datetime.now())
    updatedAt = db.Column(db.DateTime(True), nullable=False, default=datetime.datetime.now())

class GeoJSON(BaseModel):
    __tablename__ = 'GeoJSONs'
    field_seq = Sequence(f'{__tablename__}_id_seq')

    id = db.Column(db.Integer, field_seq, primary_key=True, server_default=field_seq.next_value())
    user_id = db.Column(db.ForeignKey(
        'Users.id', ondelete='CASCADE', onupdate='CASCADE'))
    name = db.Column(db.String(255), nullable=True, unique=False)
    uuid = db.Column(db.String(255), nullable=True, unique=True)
    geojson = db.Column(psql.JSONB)
    createdAt = db.Column(db.DateTime(True), nullable=False, default=datetime.datetime.now())
    updatedAt = db.Column(db.DateTime(True), nullable=False, default=datetime.datetime.now())

    user = db.relationship('User', primaryjoin='GeoJSON.user_id == User.id',
                           backref=db.backref('geojsons', lazy='joined'))



