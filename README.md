# Enrollment-Server

## Deployed app
[link](https://uiucclassenroller.me/home)
## Environment Setup
Run the following command to install python virtual environment
```sh
pip install virtualenv
```

Run the following command to create a python virtual environment
```sh
virtualenv .venv
```

Run the following command to activate python virtual environment and install all dependencies
```sh
source .venv/bin/activate
pip install -r requirements.txt
```

To deactivate from virtual environment, simply run
```sh
deactivate
```

## Config Change
Go to `config.py` and replace the following lines with [Google Doc](https://docs.google.com/document/d/1OoLDgtizLbU3ttRV0B8JGgLaq3MjAVGFZsZ3hj8bSXI/edit?usp=sharing)

```python
DB_CONFIG = {
    'host':'sql.freedb.tech',
    'user': 'freedb_uiuc-class-enroller-admin',
    'password': os.environ['DB_PASSWORD'],
    'database': 'freedb_uiuc-class-enroller-db'
}
```
## Run Server
Run the command
```sh
flask run
```
