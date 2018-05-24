FROM node:alpine

ARG app_env
ENV APP_ENV $app_env

WORKDIR /frontend
COPY . .
RUN npm install && npm run build

EXPOSE 80
ENTRYPOINT [ "npm", "run", "start" ]
