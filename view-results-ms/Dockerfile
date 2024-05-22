# Use the official Node.js image as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files to the working directory
COPY . .

# Copy the .env file
COPY .env .env

# Expose the port on which the application will run
EXPOSE 7002

# Start the application
CMD ["node", "server.js"]
