#Dockerfile

# Use this image as the platform to build the app
FROM node:20

# The WORKDIR instruction sets the working directory for everything that will happen next
WORKDIR /usr/src/app

# Step 3: Copy package file
COPY package*.json ./

# Step 4: Copy Prisma schema file
COPY prisma ./prisma

# Clean install all node modules
RUN npm ci

# Step 6: Copy application code
COPY . .

# Build SvelteKit app
RUN npm run build

# Delete source code files that were used to build the app that are no longer needed
RUN rm -rf src/ static/ emailTemplates/ docker-compose.yml

# The USER instruction sets the user name to use as the default user for the remainder of the current stage
USER node:node

# This is the command that will be run inside the image when you tell Docker to start the container
CMD ["npm", "run", "preview"]