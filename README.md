#Task Tracker
To run firstly install dependencies:
```
npm install
```
Run command to start server:
```
npm run server
```

##Users table

It can be accessed through '/user' route

To make _GET_ request to user list you don't need any specified JSON

_POST_ request to server to create new user
```
{
  "first_name": "",
  "last_name": ""
}
```
_PUT_ to users table
```
{
  "user_id": 1,
  "first_name": "",
  "last_name": ""
}
```
_DELETE_ user from users table
```
{
  "last_name": ""
}
```

##Tasks table

It can be accessed through '/task' route

_GET_ request can be affected by filter by id:
```
{
  "id": {
    "from": 1,
    "to": 5
  }
}
```
or status:
```
{
  "status": "In Progress"
}
```
_POST_ new task JSON
```
{
  "title": "",
  "description": "",
	"status": "", // ["View", "In Progress", "Done"]
  "executor": "" // Only existing in users table
}
```
_PUT_ to change existing task must be defined id of task you want to change and fields with new values
```
{
  "id": 1,
  "title": "",
  "description": "",
	"status": "", // ["View", "In Progress", "Done"]
  "executor": "" // Only existing in users table
}
```
_DELETE_ task which has defined in JSON values
```
{
  "status": "Done"
}
```
