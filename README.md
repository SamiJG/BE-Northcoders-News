# Northcoders News - API Endpoints

A project to deliver Northcoders News via a dedicated RESTful API.

Visit https://nc-news-sami.herokuapp.com/api/ to view all the API Endpoints.

## Getting Started

### Prerequisites

* Node.js
* MongoDB

### Installing

Clone or fork the repository

Navigate into folder and install dependencies

```
npm install
```

Start MongoDB

```
mongod
```

Seed the database

```
npm run seed:dev
```

Run the server

```
npm run dev
```

See deployment for notes on how to deploy the project on a live system.

### Testing

Tests written using Chai and Supertest in a Mocha test framework. To run tests type the below into the command line.

```
npm test
```

These tests check that each API endpoint returns the correct data from the Mongo Database, and that any errors are correctly handled.

## API Endpoints

Return all topics

```
GET /api/topics
```

Returns all articles of a given topic

```
GET /api/topics/:topic/articles
```

Returns a JSON object containing all articles

```
GET /api/articles
```

Returns a JSON object containing comments for a given article and the article itself

```
GET /api/articles/:article_id/comments
```

Adds a comment to the database and returns a JSON object containing the posted comment.
This route requires a JSON body with a comment key value pair
eg {"comment": "This is my new comment"}

```
POST /api/articles/:article_id/comments
```

Changes the vote count of a given article and returns a JSON object containing the article.
Increment or Decrement the votes of an article by one. This route requires a vote query of 'up' or 'down'
e.g: http://nc-news-sami.herokuapp.com/api/articles/:article_id?vote=up

```
PUT /api/articles/:article_id
```

Changes the vote count of a given comment and returns a JSON object containing the comment
Increment or Decrement the votes of an article by one. This route requires a vote query of 'up' or 'down'
e.g: http://nc-news-sami.herokuapp.com/api/comments/:comment_id?vote=down

```
PUT /api/comments/:comment_id
```

Returns a JSON object containing the deleted comment and confirmation that comment has been deleted

```
DELETE /api/comments/:comment_id
```

Returns a JSON object containing all user information

```
GET /api/users/
```

Returns a JSON object containing all articles by the specified user and their user data.

```
GET /api/users/:username/articles
```

## Deployment

Add additional notes about how to deploy this on a live system

## Built With

* [Node](https://nodejs.org/en/) - Development Environment
* [MongoDB](https://www.mongodb.com/) - Database Storage
* [Express](https://expressjs.com/) - Web Application Framework

## Author

* **Sami Gildart** - [SamiJG](https://github.com/SamiJG)

### Acknowledgements

* Northcoders
