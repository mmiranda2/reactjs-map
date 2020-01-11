import os
import json
import requests
from uuid import uuid4
import contextlib
import subprocess
import datetime
import re
from flask import Blueprint, request, Response, send_file
from models import User, GeoJSON
from application import db
from shapely.geometry import Point
from shapely.geometry.polygon import Polygon

data = Blueprint('data', __name__)


@data.route('/save_polygon', methods=['POST'])
def save_polygon():
	data = request.get_json()
	user = data['user']
	poly = data['poly']
	name = data['name']

	this_user_id = User.query.filter_by(email=user).first().id
	geojson = {
		"type": "FeatureCollection",
		"features": [
			{
				"type": "Feature",
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[ [ pt['lat'], pt['lng'] ] for pt in poly ]
					],
				},
				"properties": {
					"someMetric": 0,
				}
			 }
		]
	}
	geojson_entry = GeoJSON(user_id=this_user_id, uuid=str(uuid4()), geojson=geojson, name=name)
	db.session.add(geojson_entry)
	db.session.commit()

	return {'success': True}


@data.route('/get_pointsets', methods=['GET'])
def get_pointsets():
	email = request.args.get('email')
	if email:
		this_user_id = User.query.filter_by(email=email).first().id
		geojson_rows = GeoJSON.query.filter_by(user_id=this_user_id)
	else:
		geojson_rows = GeoJSON.query.filter_by(id=1)

	pointsets = [ 
		{
			'pointset': [
				{
					'lat': feature['geometry']['coordinates'][0],
					'lng': feature['geometry']['coordinates'][1],
					'properties': feature['properties']
				} for feature in row.geojson['features'] if feature['geometry']['type'] == 'Point'
			],
			'uuid': row.uuid,
			'name': row.name
		} for row in geojson_rows
	]
	pointsets = [ pointset for pointset in pointsets if len(pointset['pointset']) ]

	return {'success': True, 'savedPointsets': pointsets }


@data.route('/get_metrics', methods=['GET'])
def get_metrics():
	uuid = request.args.get('uuid')
	_poly = json.loads(request.args.get('poly'))
	geojson = GeoJSON.query.filter_by(uuid=uuid).first().geojson

	props = set()
	for feature in geojson['features']:
		for prop in feature['properties']:
			props.add(prop)
	props = list(props)

	_points = [
		(
			feature['geometry']['coordinates'][0],
			feature['geometry']['coordinates'][1]
		) for feature in geojson['features']
	]

	points = [ (i, Point(p[0], p[1])) for i, p in enumerate(_points) ]
	poly = Polygon([(p['lat'], p['lng']) for p in _poly])

	points_in_poly = [ (pt[0], _points[pt[0]]) for pt in points if poly.contains(pt[1]) ]
	indices = [pt[0] for pt in points_in_poly]
	internal_metrics = {
		prop: list(map(lambda x: int(x), [ 
			feature['properties'][prop] for i, feature in enumerate(geojson['features']) if i in indices
		])) for prop in props
	}

	return {
		'pointsInPoly': points_in_poly,
		'sumMetrics': { prop: sum(internal_metrics[prop]) for prop in props }
	}

@data.route('/saved_polys', methods=['GET'])
def saved_polys():
	email = request.args.get('email')
	this_user = User.query.filter_by(email=email).first()

	user_geojson_rows = GeoJSON.query.filter_by(user_id=this_user.id)
	if not user_geojson_rows:
		return { 'success': True, 'polys': [] }

	user_features = [ (row.name, row.geojson['features'][0]) for row in user_geojson_rows ]
	user_polys = [ 
		(
			feature[0],
			feature[1]['geometry']['coordinates'][0]
		) for feature in user_features if feature[1]['geometry']['type'] == 'Polygon'
	]
	
	return { 
		'success': True,
		'polys': [ 
			{ 
				'name': poly[0],
				'poly': [ { 'lat': coord[0], 'lng': coord[1] } for coord in poly[1] ]
			} for poly in user_polys 
		] 
	}

@data.route('/upload_points', methods=['POST'])
def upload_points():
	for _file in request.files:
		file_obj = request.files[_file]
		email = _file.split('###')[0]
		this_user_id = User.query.filter_by(email=email).first().id
		geojson = {}

		if file_obj.content_type == 'application/json':
			geojson = json.loads(file_obj.read().decode())

		elif file_obj.content_type == 'text/csv':
			csv_str = file_obj.read().decode().strip()
			csv_rows = csv_str.split('\n')

			props = []
			if 'lat' in csv_rows[0].lower():
				headers = csv_rows.pop(0).split(',')
				if len(headers) > 2:
					props = headers[2:]

			csv_rows = list(map(lambda s: s.replace(' ', '').split(','), csv_rows))

			geojson = {
				"type": "FeatureCollection",
				"features": []
			}
			for row in csv_rows:
				point_json = {
					"type": "Feature",
					"geometry": {
						"type": "Point",
						"coordinates": [ float(row[0]), float(row[1]) ]
					},
					"properties": { prop: row[2 + i] for i, prop in enumerate(props) }
				}
				geojson["features"].append(point_json)

		if not geojson:
			return { 'success': False, 'reason': 'bad file type or submitted empty file' }

		geojson_row = GeoJSON(user_id=this_user_id, name=file_obj.filename, uuid=str(uuid4()), geojson=geojson)
		db.session.add(geojson_row)
		db.session.commit()
			
	return { 'success': True }

################################################################

@data.route('/get_geojson', methods=['GET'])
def get_geojson():
	with open('./server/data/example.json', 'rb') as f:
		geojson = json.load(f)
	return geojson
