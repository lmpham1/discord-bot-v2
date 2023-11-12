# ---- Base Node ----
FROM node:16.15.1 AS base
# set working directory
WORKDIR /app
# Copy package files first to leverage Docker cache
COPY package.json yarn.lock ./

# ---- Dependencies ----
# Install production node_modules
RUN yarn install --production

# ---- Release ----
FROM base AS release
# Copy production node_modules
COPY --from=base /app/node_modules ./node_modules
# Copy necessary source files and other resources
COPY ./src ./src

# Define CMD
CMD ["sh", "-c", "yarn run deploy && yarn run start"]
