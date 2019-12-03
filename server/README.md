Create virtual env
```console
virtualenv venv --python=python3.8
```


Run it
```console
source venv/bin/activate

export FLASK_APP=recoord
export FLASK_ENV=development

pip install -e .
flask run
```
