### What does it do?

You can see the app by going to http://www.react-map.fun

This is a basic GIS data application that implements a point-in-polygon function with the ability to upload and save your own point data and polygons. Try it out by clicking Map Menu -> Load Points and then click various spots on the map to make a polygon. If that polygon contains points you can go to Map Menu -> Number of Points in Poly to reveal metrics. If you want to start another polygon go to Map Menu -> Clear Drawing.

The application also allows you to create an account (top left) and upload and save your own GeoJSON or coordinate data. Once you've signed in to the application you can go to Map Menu -> Upload Point Set to upload and save your own data. Accepted data formats include a GeoJSON FeatureCollection or a CSV of lat,lng,metric_a,metric_b,... data. Consult the sidebar for more help.

### What's the software stack?

This application uses a Flask/python back-end and a React.js/Redux front-end. The map is rendered using the Google Maps API. It uses gunicorn (https://gunicorn.org) for a WSGI HTTP server. The Flask back-end communicates to a PostgresQL database through a SQLAlchemy ORM. The application is hosted through Heroku.

### How to clone the repo and develop

clone the repo

```
git clone https://github.com/mmiranda2/reactjs-map.git
```

make your .env
it should look something like this:
```
FLASK_PORT=5000
FLASK_CONFIG=config.Development
DB_USER=postgres
DB_HOST=localhost
DB_PORT=5432
DB_PASS=
DB_NAME=app
FLASK_ENV=development
REACT_APP_GOOGLE_API_KEY=__google__api__key__here__
REACT_APP_GOOGLE_URL=__google__api__url__here__
```
To get a Google API key you'll have to get one through the google cloud console.

Now to get the front-end node/js dependencies
```
npm install
```

Get the back-end python dependencies
```
pip3 install -r requirements.txt
```

make postgres db (make sure you have PostgresQL installed on your machine)

```
createdb app
```

then to create all the database tables

```
python3 manager.py db upgrade
```

and to seed the database

```
python3 manager.py seed
```

to run the app

```
sh runserver.sh
```

and to stop/kill front-end and back-end:

```
sh kill.sh # on linux replace sh with bash
```

