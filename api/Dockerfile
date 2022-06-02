FROM node:16

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package*.json ./

# If you are building your code for production
# RUN npm ci --only=production
RUN npm install
COPY . .

EXPOSE 9103
CMD ["npm","run","dev"]
