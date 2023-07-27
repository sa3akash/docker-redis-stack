FROM node:18
WORKDIR /app
COPY package*.json ./
RUN yarn
COPY . .
CMD [ "yarn", "dev"]