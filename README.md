# Mobilab Account Management Service

A simple account management service which defines basic models Customer, Account and Transaction and allows interaction between them.

## Development Stack
* Node version 11.15
* Loopback 4
* Typescript
* Mocha
* MySQL 5.7
* Docker

Benefit of using Loopback for this project is that it provides a nice open API framework to
easily create and share APIs.

To start the project open terminal in root directory of project.

Execute following commands in terminal to:

1. build the service:
```bash
  npm run build
```

2. start the service:
```bash
  npm run start
```

3. To start this service and MySQL in docker container
```bash
  docker-compose build
  docker-compose up
```

4. To execute mocha tests
```bash
  npm run test
```

## API Documentation
This project provides [API spec](openapi.json) which is according to open API specifications.
That means this spec file can be imported into any open api tool to learn more about the API.
One such tool is [https://hub.apitree.com/](https://github.com/user/repo/blob/branch/other_file.md)



[![LoopBack](https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png)](http://loopback.io/)
