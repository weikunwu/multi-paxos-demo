# Multi-Paxos-Demo

## Deployed app
[link](https://multipaxosdemo.fly.dev/)
## Environment Setup
### UI
To setup UI, make sure node 16+ is installed. Then change directory into webapp and run
```sh
npm install
```
After installation is complete run
```
npm run build
```

### Web host
To setup web host, make sure you are at the project directory.
Run the following command to install python virtual environment
```sh
pip install virtualenv
```

Run the following command to create a python virtual environment
```sh
virtualenv .venv
```

Run the following command to activate python virtual environment and install all dependencies
### For mac/linux
```sh
source .venv/bin/activate
pip install -r requirements.txt
```
### For windows
```sh
.venv/Scripts/activate
pip install -r requirements.txt
```
To deactivate from virtual environment, simply run
```sh
deactivate
```

## Run Server
Run the command
```sh
flask run
```
