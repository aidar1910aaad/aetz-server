# Use Node.js 20 LTS
FROM node:20-alpine

# Install required dependencies
RUN apk add --no-cache python3 make g++

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm ci

# Bundle app source
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:prod"] 