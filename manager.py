import os
from dotenv import load_dotenv
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Sequence
from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand
from pyserver import db, app
from glob import glob
import importlib.util
import models

class SeedMeta(db.Model):
    __tablename__ = 'seed_meta'
    field_seq = Sequence(f'{__tablename__}_id_seq')

    id = db.Column(db.Integer, field_seq, primary_key=True, server_default=field_seq.next_value())
    name = db.Column(db.String(255))

if os.path.exists('./.env') and os.path.isfile('./.env'):
    load_dotenv()

migrate = Migrate(app, db)
manager = Manager(app)
manager.add_command('db', MigrateCommand)

@manager.command
def seed():
    seeds = glob(f'{os.getcwd()}/seeds/*.py')
    for seed in seeds:
        exists = SeedMeta.query.filter_by(name=seed).first()
        if not exists:
            spec = importlib.util.spec_from_file_location("module.name", seed)
            foo = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(foo)
            foo.run()
            plant = SeedMeta(name=seed)
            db.session.add(plant)
            db.session.commit()

if __name__ == '__main__':
    manager.run()
