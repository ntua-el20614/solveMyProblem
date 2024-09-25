# Login Microservice

The **Login Microservice** handles user authentication, registration, and user credit management, built using **Node.js**, **Express**, and **MongoDB**. It provides a RESTful API for login, register and credit modification, while also interracting with a RabbitMQ message queue for async tasks.

## Table of Contents

- [Features](#features)
- [Routes](#routes)
- [Environment Variables](#environment-variables)
- [Docker Support](#docker-support)
- [Running the Application](#running-the-application)

## Features

- **User Registration**: Register new users and securely store hashed passwords.
- **User Authentication**: Login functionality with JWT-based authentication.
- **Credit Management**: Modify and view user credits and temporary credits.
- **RabbitMQ Integration**: Consumes messages from a RabbitMQ queue.
  
## Routes

| HTTP Method | Endpoint | Description |
|-------------|----------|-------------|
| POST        | `/register` | Registers a new user |
| POST        | `/login` | Authenticates a user and returns a JWT |
| POST        | `/logout` | Logs the user out |
| GET         | `/users` | Fetches all registered users |
| GET         | `/view_temp_credits/:username` | Views temporary credits for a user |
| GET         | `/view_credits/:username` | Views actual credits for a user |
| POST        | `/change_temp_credits/:username/:value` | Modifies a user's temporary credits |
| POST        | `/change_credits/:username/:value` | Modifies a user's actual credits |

## Environment Variables

You will need to set the following environment variables in a `.env` file:

```bash
MONGO_URI=<Your MongoDB URI>
PORT=<The port on which the service will run>
JWT_SECRET=<Your JWT secret key>
RABBITMQ_URL=<Your RabbitMQ URL>
```
## Docker Support

1. **Ensure that RabbitMQ is running in a Docker container**
```bash
docker run -d --hostname rabbitmq --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:management
```
2. **Ensure that MongoDB is running in a Docker container**
```bash
docker run -d --name mongodb -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=<username> -e MONGO_INITDB_ROOT_PASSWORD=<password> mongo
```

## Running the Application

1. **Ensure MongoDB and RabbitMQ are running and configured.**
2. **Set up the environment variables in the `.env` file.**
3. Start the application using:

```bash
docker build -t login-ms .
docker run -p 7001:7001 --env-file .env --name login-ms login-ms
```

