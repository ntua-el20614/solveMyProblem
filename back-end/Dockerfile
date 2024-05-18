# Specify the base image
FROM node:18-alpine AS Production

#ENV
ENV NODE_ENV=production

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Copy the rest of the application code to the working directory
COPY . .

# Install dependencies
RUN npm install

# Expose the port on which the application will run
EXPOSE 1188

# Start the application
CMD [ "npm", "start" ]
