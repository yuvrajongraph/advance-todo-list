
# Advance calendar app

In backend side, this app is use to make the apis for authentication(register,login,logout) , CRUD apis for todo and appoinment events , api to upload an image, etc. , which can be sync with the frontend part of the web app

This app is helpful for all those user who are not easily remember the event they want to attend.


## Installation

Setup and Install the project with the following steps

```bash
npm init -y 
npm i express nodemon 
```

in package.json,
```bash
"scripts": {
    "start": "set NODE_ENV=development &&  nodemon index.js "
},
```
and lastly,
```bash
npm run start
```

## Database connection configuration

```bash
npm install mongoose
```
In app.js,
```bash
mongoose.connect(config.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
```
DB_URL is the database url that you want to give in above code,
and try to connect the databse with node server by installing the MongoDB compass 
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file



`JWT_SECRET` 

`SERVER_PORT` 

`DB_URL`

`FRONTEND_URL` 

`CLIENT_ID`

`CLIENT_SECRET` 

`REFRESH_TOKEN` 

`REDIRECT_URI` 

`GOOGLE_CLIENT_ID` 

`GOOGLE_CLIENT_SECRET` 

`GOOGLE_CONTACT_CLIENT_ID` 

`GOOGLE_CONTACT_CLIENT_SECRET` 

`GOOGLE_REDIRECT_URI` 

`CALENDAR_API_KEY` 

`CLOUD_NAME` 

`API_KEY` 

`API_SECRET` 






## Project structrure

- /config
  - config.js
- /controllers
  - user.controller.js
- /models
  - user.model.js
- /helper
  - user.helper.js
- /middlewares
  - user.middleware.js
- /routes
  - index.js
  - user.route.js
- /uploads
  - myImage-170748950example_1.jpeg
- /utils
  - user.util.js
- /validators
  - user.validator.js
- /views
  - index.ejs

- app.js
- index.js
- env.sample
- package.json




## API documentation

#### Register a user

```http
  POST /api/auth/signup
```
##### Request body
```http
 {
    "name":"dummy",
    "email":"dummy@gmail.com",
    "password":"111"
}
```

##### Response body
```http
{
    "statusCode": 200,
    "data": {},
    "message": "Link sent to email for verification"
}
```

#### Verify the registration

```http
  GET /api/auth/signup?token=${token}
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `token`      | `string` | **Required**. token of user |

##### Response body
```http
{
    "statusCode": 200,
    "data": {
            "_id": "6561614e282ba41b6fee0534",
            "name": "demo",
            "email": "demo@gmail.com",
            "password": "$2b$10$u15z2pFeii0CqTQjY83kSefrbctrufL6haQA5BfoU7pg4Ib4rnpiO",
            "url": "https://res.cloudinary.com/dmut0goar/image/upload/v1700881760/products/vv7h3gv6xouo7zxplv3y.jpg",
            "isRegister": true,
            "__v": 0
    },
    "message": "User Register Successful"
}
```

#### User Login 

```http
  POST /api/auth/signin
```
##### Request body
```http
 {
    "email":"dummy@gmail.com",
    "password":"111"
}
```

##### Response body
```http
{
    "statusCode": 200,
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTYxNjE0ZTI4MmJhNDFiNmZlZTA4NDYiLCJpYXQiOjE3MDE5NDUwMzl9.2zMyFbIz6EXXEBwY_j-EemkAhFtcIUeDyI5RR14btMY",
        "details": {
            "_id": "6561614e282ba41b6fee0534",
            "name": "demo",
            "email": "demo@gmail.com",
            "password": "$2b$10$u15z2pFeii0CqTQjY83kSefrbctrufL6haQA5BfoU7pg4Ib4rnpiO",
            "url": "https://res.cloudinary.com/dmut0goar/image/upload/v1700881760/products/vv7h3gv6xouo7zxplv3y.jpg",
            "isRegister": true,
            "__v": 0
        }
    },
    "message": "User Login Successful"
}
```

#### Logout User

```http
  POST /api/auth/signout
```

| Header Type | Value     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `Authorization`      | `Bearer ${token}` | **Required**. token of authenticate user

##### Response body
```http
{
    "statusCode": 202,
    "data": {},
    "message": "User Signout successful"
}
```

#### Mail for Reset password 


```http
  GET /api/auth/reset-password
```

| Header Type | Value     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `Authorization`      | `Bearer ${token}` | **Required**. token of authenticate user


##### Response body

```http
{
    "statusCode": 200,
    "data": {},
    "message": "Link sent to email for verification"
}
```

#### Reset password 

```http
  POST /api/auth/reset-password?token=${token}
```

| Header Type | Value     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `Authorization`      | `Bearer ${token}` | **Required**. token of authenticate user

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `token`      | `string` | **Required**. token of user |

##### Request body

```http
{
    "oldPassword":"12345",
    "newPassword":"1234"
}
```

##### Response body

```http
{
    "statusCode": 200,
    "data": {
    },
    "message": "Password reset successfully"
}
```



#### Create Todo item

```http
  POST /api/todo-list
```

| Header Type | Value     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `Authorization`      | `Bearer ${token}` | **Required**. token of authenticate user

##### Request body
```http
{
    "title":"pizza",
    "status":"open",
    "category":"food",
    "dateTime":"2023-12-31"
}
```

##### Response body
```http
{
    "statusCode": 201,
    "data": {
        "title": "pizza",
        "status": "open",
        "category": "food",
        "dateTime": "2023-12-31T00:00:00.000Z",
        "userId": "653b695292fd0866210f72c6",
        "_id": "6571a355b78fe53c2e64460b",
        "__v": 0
    },
    "message": "Item has been created"
}
```

#### Update Todo item

```http
  PATCH /api/todo-list/${id}
```

| Header Type | Value     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `Authorization`      | `Bearer ${token}` | **Required**. token of authenticate user

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to update |

##### Request body
```http
{
    "title":"chicken chilli",
    "dateTime":"2023-12-31"
}
```

##### Response body
```http
{
    "statusCode": 200,
    "data": {
        "title": "chicken chilli",
        "dateTime": "2023-12-31T00:00:00.000Z",
        "status": "open"
    },
    "message": "Item updated successfully"
}
```

#### Delete Todo item

```http
  DELETE /api/todo-list/${id}
```

| Header Type | Value     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `Authorization`      | `Bearer ${token}` | **Required**. token of authenticate user

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to delete |


##### Response body
```http
{
    "statusCode": 200,
    "data": {
        "title": "pizza",
        "status": "open",
        "category": "food",
        "dateTime": "2023-12-31T00:00:00.000Z",
        "userId": "653b695292fd0866210f72c6",
        "_id": "6571a355b78fe53c2e64460b",
        "__v": 0
    },
    "message": "Item deleted successfully"
}
```

#### Get all Todo items

```http
  GET /api/todo-list
```

| Header Type | Value     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `Authorization`      | `Bearer ${token}` | **Required**. token of authenticate user

##### Response body
```http
{
    "statusCode": 200,
    "data": [
    {
        "title": "pizza",
        "status": "open",
        "category": "food",
        "dateTime": "2023-12-31T00:00:00.000Z",
        "userId": "653b695292fd0866210f72c6",
        "_id": "6571a355b78fe53c2e64460b",
        "__v": 0
    }
    ],
    "message": "OK"
}
```


#### Create Appointment 

```http
  POST /api/appointment
```

| Header Type | Value     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `Authorization`      | `Bearer ${token}` | **Required**. token of authenticate user

##### Request body
```http
{
    "title":"mri checkup",
    "startTime":"2023-11-20",
    "endTime":"2023-12-21"
}
```

##### Response body
```http
{
    "statusCode": 201,
    "data": {
        "title": "mri checkup",
        "status": "open",
        "startTime": "2023-11-20T00:00:00.000Z",
        "endTime": "2023-12-21T00:00:00.000Z",
        "userId": "653b695292fd0866210f72c6",
        "_id": "6571a6f2b78fe53c2e644d5c",
        "__v": 0
    },
    "message": "Appointment has been created"
}
```

#### Update Appointment 

```http
  PATCH /api/appointment/${id}
```

| Header Type | Value     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `Authorization`      | `Bearer ${token}` | **Required**. token of authenticate user


| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to update |

##### Request body
```http
{
    "startTime":"2023-11-23",
    "endTime":"2023-12-24"
}
```

##### Response body
```http
{
    "statusCode": 200,
    "data": {
        "startTime": "2023-11-23T00:00:00.000Z",
        "endTime": "2023-12-24T00:00:00.000Z",
        "status": "open"
    },
    "message": "Appointment updated successfully"
}
```

#### Delete Appointment

```http
  DELETE /api/appointment/${id}
```

| Header Type | Value     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `Authorization`      | `Bearer ${token}` | **Required**. token of authenticate user


| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to delete |


##### Response body
```http
{
    "statusCode": 200,
    "data": [
        {
            "_id": "6571a6f2b78fe53c2e644d5c",
            "title": "mri checkup",
            "status": "open",
            "startTime": "2023-11-20T00:00:00.000Z",
            "endTime": "2023-12-21T00:00:00.000Z",
            "userId": "653b695292fd0866210f72c6",
            "__v": 0
        }
    ],
    "message": "Appointment deleted successfully"
}
```


#### Get All Appointments

```http
  GET /api/appointment
```

| Header Type | Value     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `Authorization`      | `Bearer ${token}` | **Required**. token of authenticate user

##### Response body
```http
{
    "statusCode": 200,
    "data": [
        {
            "_id": "6571a6f2b78fe53c2e644d5c",
            "title": "mri checkup",
            "status": "open",
            "startTime": "2023-11-20T00:00:00.000Z",
            "endTime": "2023-12-21T00:00:00.000Z",
            "userId": "653b695292fd0866210f72c6",
            "__v": 0
        }
    ],
    "message": "OK"
}
```








## Features 
- Authentication APIS
- Reset password APIS
- CRUD APIS for todo and appointment
- Upload image API 
- Google OAuth APIS of google contact, user info, and calendar

## Functionality

Node application contain the bussiness logic of all apis that are require to run the frontend part. In register user api there is  use of sendMail function present in utils folder which is made by node-mailer package, and then the token is use to verify the user in query parameter using jsonwebtoken package. In login api we use to send the token to the frontend and this token is set in authorization params of header with Bearer type to authorize the user, then we make the CRUD apis of todo and appointment events. We also use multer package to read the image file from form data and get store in the uploads folder and from there we pass it through the utility function which return the cloudinary link of that photon and that we return in the response to client. We also make the use of google apis from google package by setting the oauthclient with client id ,client secret and redirect uri  and from that we get an authorization code which is use to exchange the refresh and access token from google and set it in the credential of oauthclient and after that we can access to google calendar,contact,profile with the scopes that we have passed while making the oauthclient in node from google apis.


## Technologies Used

The technologies, frameworks, libraries, or APIs used in our project are as follows

- Node.js
- Express.js 
- MongoDB
- Multer
  etc.

## Error Handling

All the error of the node application has been handle by the two functions present in the helper folder name and file names are commonFunctions.helper.js  and errorHandler.helper.js which return the error and success message with their status code from the controllers , validators, etc. 

## Conclusion

End with a concluding note, thanking users for checking out your project and inviting feedback or suggestions.
