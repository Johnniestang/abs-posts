# ABS Assessment

## Requirements

Pretty much whatever I wish to build! I've decided on an API to add user comments.

- The API should support `CREATE`, `READ`, `UPDATE`, `DELETE` of the `posts` resource with validation.
- Support fetching multiple posts, a single post, and filtering posts by user.
- Connect to NoSQL db for persistence. 
- Authentication (JWT)
- Use a persistent DB (mongo)
- Cover all the important behavior of the code with automated tests.
<br/>
<br/>

## Installing and running the Application

Install the node modules:
Execute `npm install`  
Once installed, start the server:
Execute `npm run server`  
The endpoints are:  
<br/>

### Public routes
| Verb | route | action |
| ---- | ----- | ------ |
| post | api/users | create User |
| post | api/auth' | set Auth User - Log in |
| get | api/posts | get All Posts |
| get | api/posts/:id | get Post By Id |
| get | api/posts/user/:id | get Posts By UserId |  

<br/>

### Protected routes
| Verb | route | action |
| ---- | ----- | ------ |
| get | api/auth | get Auth User - send current token and get user details  |
| post | api/posts | add Post |
| put | api/posts/:id | edit Post |
| delete | api/posts/:id | delete Post |  

<br/>
<br/>

Before being able to post, you must create a user. A user can be created by sending json to the create User route:
<br/>
``` javascript
{
    "name": "Levi Morris",
    "email": "levi@gmail.com",
    "expertise": "Playing with legos",
    "password": "12345678"
}
```

A token is returned in the json and should be passed in the header when reaching the protected routes. A Postman collection is included to assist in routes and token.
<br/>
<br/>

### Postman
The included Postman file will add the token to the protected routes once you create a user and then "authenticate"

| Verb | route | action |
| ---- | ----- | ------ |
| post | api/users | create User |
| post | api/auth' | set Auth User - Log in |  

<br/>
If you change users, ensure you hit the authenticate endpoint again to automatically change to the new token in Postman. Failure to do so will result in auth error when attempting protected routes.
<br/>
<br/>

| Verb | route | action |
| ---- | ----- | ------ |
| post | api/auth' | set Auth User - Log in |



