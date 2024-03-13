FROM node:16.20.2-alpine3.18

COPY . /data

WORKDIR /data

ENV JWT_SECRET=tutor
ENV NODE_ENV=production
RUN npm install 

CMD npm run dbmigrate && node app.js
