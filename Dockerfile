FROM node:latest

RUN npm install -g nodemon

WORKDIR /src

COPY ./src /src

RUN npm install

CMD npm start

EXPOSE 8000
