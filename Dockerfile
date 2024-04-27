FROM node:16-alpine

COPY ./src/ /app/src

COPY ./package.json /app/package.json

COPY ./.env /app/.env

WORKDIR /app

RUN npm install

CMD [ "node", "src/app.js" ]
