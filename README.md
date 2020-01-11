```
npm install
```

```
pip3 install -r requirements.txt
```

make postgres db

```
createdb app
```

then

```
python3 manager.py db upgrade
```

```
python3 manager.py seed
```

to run the app

```
sh runserver.sh
```

to stop/kill front-end and back-end:

```
sh kill.sh
```