# View Results Microservice

The **View Results Microservice** handles the viewing of results for solved problems and integrates with RabbitMQ to receive problem results for storage. It is built using **Node.js**, **Express**, **MongoDB**, and **RabbitMQ** for message queue integration.

## Table of Contents

- [Features](#features)
- [Routes](#routes)
- [Environment Variables](#environment-variables)
- [Docker Support](#docker-support)
- [Running the Application](#running-the-application)

## Features

- **View Solved Problems**: Fetches results of solved problems by username.
- **RabbitMQ Integration**: Receives messages from RabbitMQ, processes them, and stores the problem results in the database.

## Routes

| HTTP Method | Endpoint                   | Description                                    |
|-------------|----------------------------|------------------------------------------------|
| GET         | `/view/:username`          | View results for a user                        |

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
2. **Set up the environment variables in the `.env` file.**
3. Start the application using:

```bash
docker build -t view-results-ms .
docker run -p 7002:7002 --env-file .env --network app-network --name view-results-ms view-results-ms
```
