# Specify the base image
FROM node:18-alpine AS Production

# Set environment to production (this can be optional if you're facing issues)
ENV NODE_ENV=production

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Copy local directories to the current local directory of our docker image (/app)
COPY . .

# Install dependencies
RUN npm install

# Expose the port on which the application will run
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
