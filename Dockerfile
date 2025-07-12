# Use the Alpine-based Node.js image, which is much smaller and lighterweight
# than the original. We want to pull the x86 version of the image for
# compatibility/reliability on AWS servers.
FROM --platform=linux/amd64 node:20-alpine

# Add bash because some scripts necessary to build the compose app
# require bash.
RUN apk add --no-cache bash

ENV NODE_ENV=production

# Install pnpm
RUN npm install -g pnpm

# Set the working directory in Docker
WORKDIR /app

COPY . .

# Install dependencies
# Set prod to false since we use dev dependencies for building the app
RUN pnpm install --frozen-lockfile --prod false

# Build the app
RUN pnpm run build:compose-app

EXPOSE 8080

# Command to run the application
CMD [ "pnpm", "run", "start:server" ]

