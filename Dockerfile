FROM node:latest

WORKDIR /client/

COPY . /client/

RUN npm install

CMD ["npm", "start"]

EXPOSE 6007