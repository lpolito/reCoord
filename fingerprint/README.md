Create virtual env
```console
virtualenv venv --python=python3.8
```

Run it
```console
source venv/bin/activate

pip install -e .

export FLASK_APP=recoord
export FLASK_ENV=development

flask run
```
