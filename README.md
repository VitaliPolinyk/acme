# ACME Backend

It is a demo API backend, it uses in-memory storage, so each time the service is restarted, we start with fresh database (for demo purposes it is populated with some test data).

Demo user to login:

    email: `user@backend.local`
    password: `user`

## For development

```bash
# switch to required node version (check .nvmrc)
nvm use

npm install

# create nodemon.json file from nodemon.example.json, and update it with correct configuration
cp nodemon.example.json nodemon.json

# run api
npm run dev:api

# run tests
npm run test

# API doc
http://localhost:5000/apidoc/developer
```


# ACME Frontend

It is a demo app on Ionic 4.

Demo user to login:

    email: `user@backend.local`
    password: `user`

## For development

```bash
# install all packages
npm install

# run app
ionic serve

```

## Demo:


```bash
localhost:8100
```
