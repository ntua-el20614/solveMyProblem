# Edit View Run Microservice

The **Edit View Run Microservice** handles problem submission, editing, viewing, and deletion, built using **Node.js**, **Express**, and **MongoDB**. It provides a RESTful API for handling problems and interacts with a RabbitMQ message queue for asynchronous task processing.

## Table of Contents

- [Features](#features)
- [Routes](#routes)
- [Environment Variables](#environment-variables)
- [Docker Support](#docker-support)
- [Running the Application](#running-the-application)

## Features

- **Problem Submission**: Submit problems with associated files and parameters.
- **Problem Editing**: Edit problems and update associated files.
- **Problem Deletion**: Delete problems by ID.
- **View Problems**: View all problems or filter by creator.
- **RabbitMQ Integration**: Submits problems to RabbitMQ for further processing.

## Routes

| HTTP Method | Endpoint                          | Description                                  |
|-------------|-----------------------------------|----------------------------------------------|
| POST        | `/submit`                         | Submits a new problem with an input file     |
| POST        | `/finalSubmition`                 | Submits a problem to RabbitMQ queue          |
| POST        | `/edit`                           | Edits an existing problem                    |
| DELETE      | `/delete`                         | Deletes a problem by ID                      |
| GET         | `/view`                           | Views problems submitted by a specific user  |
| GET         | `/viewAll`                        | Views all problems                           |

## Environment Variables

You will need to set the following environment variables in a `.env` file:

```bash
MONGO_URI=<Your MongoDB URI>
PORT=<The port on which the service will run>
RABBITMQ_URL=<Your RabbitMQ URL>
```
## Docker Support

1. **Create the Network** 
```bash
docker network create app-network
```
2. **Ensure that RabbitMQ is running in a Docker container**
```bash
docker run -d --network app-network --hostname rabbitmq --name rabbitmq -p 5672:5672 -p 15672:15672 -e RABBITMQ_DEFAULT_USER=user -e RABBITMQ_DEFAULT_PASS=password rabbitmq:management
```
3. **Ensure that MongoDB is running in a Docker container**
```bash
docker run -d --network app-network --name mongodb -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=<username> -e MONGO_INITDB_ROOT_PASSWORD=<password> mongo
```

## Running the Application

1. **Ensure MongoDB and RabbitMQ are running and configured.**
2. **Set up the environment variables in the .env file.**
3. Start the application using:

```bash
docker build -t edit-view-run-ms .
docker run -p 7000:7000 --env-file .env --network app-network --name edit-view-run-ms edit-view-run-ms
```

