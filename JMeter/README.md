# Load Testing with JMeter

This README provides a summary of the load tests performed using JMeter, covering the process of registering users, logging them in, adding credits, creating problems, running those problems on a solver, and saving the results.

## Test Scenarios

### 1. **Register 100 Users**
- **Purpose**: Simulate the registration of 100 users.
- **Description**: A JMeter test plan was created to register 100 users with unique usernames and passwords. Each user registration request was sent in parallel using a Thread Group configured for 100 threads.
- **Tools**: 
  - HTTP Request Sampler (POST to `/register` endpoint).
  
### 2. **Login 100 Users**
- **Purpose**: Simulate the login of the 100 registered users.
- **Description**: After the registration, the users were logged in. The login process was executed with 100 threads where each thread represented a unique user.
- **Tools**: 
  - HTTP Request Sampler (POST to `/login` endpoint).
  
### 3. **Added Credits to Users**
- **Purpose**: Add credits to all 100 users.
- **Description**: After successful login, credits were added to each user by sending a POST request to the appropriate endpoints. Each request specified the user and the amount of credits to be added.
- **Tools**:
  - HTTP Request Sampler (POST to `/add_credits`).
  
### 4. **30 Users Created 4 Problems Each**
- **Purpose**: Simulate 30 users creating 4 problems each.
- **Description**: Out of the 100 users, 30 were chosen to create problems. Each of the selected users created 4 problems, totaling 120 problems. The problems were submitted to the problem submission endpoint.
- **Tools**: 
  - HTTP Request Sampler (POST to `/submit_problem`).
  - Loop Controller to iterate 4 times for each user.
  
### 5. **Run 120 Problems on the Solver**
- **Purpose**: Run the 120 problems through the solver system.
- **Description**: The submitted problems were passed to the solver. The problem IDs were dynamically read from a CSV file and passed to the solver's endpoint for processing.
- **Tools**:
  - HTTP Request Sampler (POST to `/solve_problem`).
  - CSV Data Set Config to load problem IDs dynamically.
  
### 6. **Saved the Results in 3 CSV Files**
- **Purpose**: Store the results of the problem-solving process.
- **Description**: The results of the problem-solving process were saved in 3 CSV files for future analysis. Each file contains different categories of results based on the types of problems and their outcomes.
- **Tools**:
  - JMeter listeners to capture and save the test results in CSV format.
  
## Files
- `100userTest.jmx`: JMeter test plan for registering logging in and adding credits to users.
- `SolverTest.jmx`: JMeter test plan for solving problems.
- `Test PlanSubmition.jmx`: JMeter test plan for creating problems.

## How to Run
1. Open the JMeter `.jmx` files in Apache JMeter.
2. Ensure that the necessary CSV files for users and problem IDs are present.
3. Run each test plan in sequence:
   - First, run `100userTest.jmx`.
   - Then, run `SolverTest.jmx`.
   - Finally, run `SolverTest.jmx` to process the problems.
4. Results are saved in the CSV files for analysis.

## Results
The test results, including response times and status codes, are saved in the CSV files (`100userTestSummuryReport.csv`, `60submissionTest.csv`, `120problemsToSolverSummury.csv`), which can be used for detailed analysis of the performance and success of each test.

---

This test suite simulates the typical flow of user registration, login, problem creation, problem-solving, and result storage in a high-traffic scenario, offering valuable insights into system performance under load.
