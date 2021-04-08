# Account Management Service Built With NodeJs, Mysql and Typescript

## Requirements

For development, you will only need Node.js and a node global package, Yarn, installed in your environement.

### Node

- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
  Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v8.11.3

    $ npm --version
    6.1.0

## Installation

Clone the repository, and run `npm install`

```
git clone https://github.com/olufemi-oluwatobi/mono-customer-account.git
npm install
tsc
```

### Basic setup

    - Setup db variables in your `ormconfig.js` file, take it look at the `.env.examples` file for env variables references

    - Create database based on db name provided in env file

### start up

- Ensure that your .env file has the needed variables

- run `npm start` or `yarn start` to run express server, and redis clients. Express server runs on port 8040 by default.
  -run `npm test` or `yarn test` to execute test
- All Migrations are executed by default

### documentation

- view https://documenter.getpostman.com/view/3087547/TzCTa5fe for API documentations
