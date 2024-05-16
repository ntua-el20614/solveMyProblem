# Specify the base image
FROM node:14 AS Production

# Set environment to production (this can be optional if you're facing issues)
ENV NODE_ENV=production

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Make sure the host is set to listen on all interfaces
ENV HOST=0.0.0.0

# Expose the port on which the application will run
EXPOSE 8448

# Start the application
CMD ["npm", "start"]
