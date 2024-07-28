# Use an official Node.js image based on Debian as the base image
FROM node:18-bullseye

# Install Python and pip using Debian package manager
RUN apt-get update && apt-get install -y python3 python3-pip python3-venv

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Create a virtual environment for Python packages
RUN python3 -m venv /opt/venv

# Activate the virtual environment and install Python dependencies
COPY requirements.txt .
RUN . /opt/venv/bin/activate && pip install --upgrade pip && pip install -r requirements.txt

# Copy the rest of the application files
COPY . .

# Copy the .env file
COPY .env .env

# Ensure the virtual environment's Python is used
ENV PATH="/opt/venv/bin:$PATH"

# Set the command to run the Node.js script
CMD ["node", "solver.js"]
