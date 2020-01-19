Create virtual env
```console
virtualenv venv --python=python3.8
```

Start DB
```console
pg_ctl -D /usr/local/var/postgres start
```

Run it
```console
source venv/bin/activate

pip install -e .
manage.py runserver
```

old run command
```console
export FLASK_APP=recoord
export FLASK_ENV=development

flask run
```