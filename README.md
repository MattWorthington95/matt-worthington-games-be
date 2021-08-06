 ## Link to hosted version - 
 https://matt-worthington-games.herokuapp.com/api

## Games review RESTful API built using the following -

 - Backend - `Node.js`
 - Framework - `Express`
 - Database - `PostgreSQL / node-postgres`
 - TTD - `Jest `

The intention here was to mimick the building of a real world backend service (such as reddit) which will provide this information to the front end architecture

## Instructions of how to clone, install dependencies, seed local database, and run tests
 - Clone git repo from https://github.com/MattWorthington95/be-nc-games
 - Once cloned, run `npm i ` to install dependencies
 - run `npm setup-dbs`to start the Database in postgres 
 - run `npm test` to run all the Jest tests

##  Important step -  create the two .env files

You will need to create _two_ `.env` files for this project: `.env.test` and `.env.development`. Into each, add `PGDATABASE=<database_name_here>`, with the correct database name for that environment (see `/db/setup.sql` for the database names). Double check that these `.env` files are .gitignored.


## Minimum versions of Node.js and Postgres needed to run the project
 - psql v12.7
 - Node v14.17.3