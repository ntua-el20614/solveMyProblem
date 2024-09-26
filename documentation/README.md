# solveMyProblem - Project Management Overview

This document provides a detailed overview of the issues and progress for the *solveMyProblem* project, broken down into four sprints. Each sprint focuses on specific components and improvements to the system, following an agile development methodology.

## Sprint 1: Microservices and Backend Implementation (19/07/24-25/07/24)

### Issues:
- **Edit-view-run**  
  - *Tags*: Documentation  
  - *Description*: Implementation of the Edit-View-Run microservice.

- **Solver**  
  - *Tags*: Documentation  
  - *Description*: Solver microservice implementation.

- **Login**  
  - *Description*: Test the login implementation and ensure the logic works as expected.

## Sprint 2: Frontend Development and Docker Setup (26/07/24-01/08/24)

### Issues:
- **Frontend – Main Page**  
  - *Tags*: Documentation  
  - *Description*: Create the main page according to the provided screenshot. The page should display the user's credits and provide a link to the "Submission" page.

- **Logo**  
  - *Tags*: Documentation  
  - *Description*: Find and implement a logo for the frontend. If it's not round, create a round version for the favicon.

- **Fix Docker Compose**  
  - *Description*: Fix the issue preventing Docker from starting.

- **Frontend Connections**  
  - *Tags*: Bug  
  - *Description*: Fix the issue where the frontend cannot reach backend services when Docker containers are running. The frontend works when running `npm start`, but the containers should handle both port 4001 and 7001 correctly.

- **Edit Submission**  
  - *Description*: Create an endpoint to edit submissions and modify the existing one to retrieve the problem from the database.

## Sprint 3: RabbitMQ Integration, Backend/Frontend Enhancements (02/08/24-26/08/24)

### Issues:
- **Documentation of Backend Endpoints**  
  - *Tags*: Documentation  
  - *Description*: Provide a list of all backend endpoints for frontend implementation.

- **Admin Implementation**  
  - *Description*: Implement admin functionality for managing the application.

- **Submissions Fields**  
  - *Tags*: Bug, Enhancement  
  - *Description*: Add fields like "name" and "created-on" for each submission on the backend.

- **Frontend New Submissions Page and Functionality**  
  - *Tags*: Creation  
  - *Description*: Develop the new submissions page and make the "Submit" button functional.

- **Fix Homepage Issues**  
  - *Tags*: Bug, Help Wanted  
  - *Description*: Fix various issues on the homepage, including border radius, fullscreen behavior, and make the delete button functional.

- **View Results Frontend Page**  
  - *Tags*: Creation  
  - *Description*: Create the "View Results" page on the frontend and ensure it functions correctly.

- **ID Mismatch Between Microservices**  
  - *Tags*: Bug, Help Wanted  
  - *Description*: Fix ID mismatch between the "Edit-View-Run" microservice and the "View Results" microservice.

- **Solver Issue**  
  - *Tags*: Bug  
  - *Description*: Handle the case where non-numeric parameters are submitted, causing the solver to run indefinitely.

- **Solver Submission Error**  
  - *Tags*: Bug  
  - *Description*: Ensure the solver correctly passes the result of a submission to the correct endpoint.

- **View Results Endpoint**  
  - *Tags*: Enhancement, Help Wanted  
  - *Description*: Add parameters such as `name`, `param1`, `param2`, `param3`, and `executedOn` to the `/view` endpoint.

- **View-Edit Page**  
  - *Tags*: Creation  
  - *Description*: Create the page that allows users to edit the submission and the corresponding `.json` file.

- **Edit Balance**  
  - *Tags*: Creation  
  - *Description*: Implement the frontend functionality for users to view and edit their credits.

- **Submission Page Parameters**  
  - *Description*: Rename parameters on the submission page:
    - Parameter1 -> `num_vehicles`
    - Parameter2 -> `depot`
    - Parameter3 -> `max_distance`

- **Submission Queue State**  
  - *Tags*: Bug, Invalid  
  - *Description*: Create a new state "inProgress" for submissions waiting to be executed in the queue.

- **Endpoints for Credits**  
  - *Description*: Create two endpoints to handle user credits and temporary credits as URL parameters.

## Sprint 4: Final Stretch, Fixes, and Optimizations (28/08/24-26/09/24)

### Issues:
- **Fix Code Structure**  
  - *Tags*: Bug  
  - *Description*: Organize and refactor code for better maintainability.

- **Solver Microservice Stability**  
  - *Tags*: Bug, Help Wanted  
  - *Description*: Ensure the solver microservice remains available even after encountering errors.

- **Credits Backend Implementation**  
  - *Tags*: Creation, Help Wanted  
  - *Description*: Subtract one point from the user's credits after a submission is executed successfully.

- **Docker-compose Enhancement**  
  - *Tags*: Enhancement  
  - *Description*: Ensure microservices restart automatically when they exit.

- **Health Checks**  
  - *Tags*: Enhancement  
  - *Description*: Implement health checks for each microservice, accessible via `/healthcheck`, to verify their status.

- **Cybersecurity**  
  - *Description*: Ensure that logged-out users cannot access restricted pages by pressing "Back" after logging out.

- **Testing**  
  - *Tags*: Enhancement, Help Wanted  
  - *Description*: Test the latest changes before merging them into the main branch.

- **Delete Button Access**  
  - *Tags*: Wontfix  
  - *Description*: Disable the delete button when a submission is in the "In Queue" state.

- **Credit Updates After Submission**  
  - *Description*: Ensure user credits are updated correctly after a submission is processed.

- **Frontend Adjustments**  
  - *Tags*: Bug  
  - *Description*: 
    - Adjust spacing on the homepage.
    - Disable the delete button when a submission is running.
    - Allow users to view submission details while it is in progress.

---

### Additional Notes:
For a detailed list of all issues and their status, please refer to our GitHub [Issue History](https://github.com/ntua-el20614/solveMyProblem/issues?q=is%3Aissue+is%3Aclosed). Each issue is tagged appropriately based on its status, priority, and related sprint.

---
