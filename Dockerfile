FROM node:16.20.2-alpine3.18

COPY . /data

WORKDIR /data

ENV JWT_SECRET = 'tutor'

RUN npm install 

CMD ["node","app.js"]