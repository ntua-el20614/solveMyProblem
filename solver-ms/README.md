# Solver Microservice

The **Solver Microservice** is responsible for solving Vehicle Routing Problems (VRP) using a Python script and **Google OR-Tools**. It consumes a problem data from a RabbitMQ message queue, processes it, and sends the results back to another queue. This microservice is built using **Node.js**, **RabbitMQ**, and **Python** with **OR-Tools**.

## Table of Contents

- [Features](#features)
- [Structure](#structure)
- [Environment Variables](#environment-variables)
- [Python Requirements](#python-requirements)
- [Docker Support](#docker-support)
- [Running the Application](#running-the-application)

## Features

- **Queue-based Processing**: The microservice consumes problem data from the `problem_queue`, processes it, and sends results to the `solvedProblems` queue.
- **Python VRP Solver**: The core VRP solution is computed using a Python script that utilizes **Google OR-Tools**.
- **Multiple Queue Support**: Updates the problem status and handles user credit adjustments by publishing to different RabbitMQ queues (`status_queue`, `credit_queue`).

## Structure

- **solver.js**: The main service file responsible for connecting to RabbitMQ, consuming messages, and executing the Python solver.
- **vrpSolver.py**: Python script that solves the Vehicle Routing Problem using **Google OR-Tools**.
- **RabbitMQ Queues**:
  - `problem_queue`: Receives problem data to be solved.
  - `solvedProblems`: Stores the results of the solved problems.
  - `status_queue`: Tracks the status of the problem-solving process.
  - `credit_queue`: Updates user credits based on problem submission.

## Environment Variables

You will need to set the following environment variables in a `.env` file:

```bash
RABBITMQ_URL=<Your RabbitMQ URL>
```
## Python Requirements
The VRP solver depends on Google OR-Tools. You can find the dependencies in the requirements.txt file.

## Docker Support

1. **Create the Network** 
```bash
docker network create app-network
```
2. **Ensure that RabbitMQ is running in a Docker container**
```bash
docker run -d --network app-network --hostname rabbitmq --name rabbitmq -p 5672:5672 -p 15672:15672 -e RABBITMQ_DEFAULT_USER=user -e RABBITMQ_DEFAULT_PASS=password rabbitmq:management
```

## Running the Application
1. **Ensure RabbitMQ is running and configured.**
2. **Set up the environment variables in the .env file.**
3. Start the application using:
```bash
docker build -t vrp-solver-ms .
docker run -p 7003:7003 --env-file .env --network app-network --name vrp-solver-ms vrp-solver-ms
```
