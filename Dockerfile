# Use Node.js as base image
FROM node:14

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json for server.js
COPY specificbot/package*.json ./

# Install dependencies for server.js
RUN npm install express @google/generative-ai dotenv cors node-fetch

# Copy server.js into the container
COPY specificbot/server.js ./

# Set working directory to public
WORKDIR /usr/src/app/public

# Copy all other files from public directory
COPY specificbot/public/ ./

# Expose port 5503 (assuming this is the port your Express server listens on)
EXPOSE 5503

# Command to run the application
CMD ["node", "../server.js"]
