FROM node as build

ENV NPM_CONFIG_LOGLEVEL warn
ARG app_env
ENV APP_ENV $app_env

RUN mkdir -p /frontend
WORKDIR /frontend
COPY . .

RUN yarn build
EXPOSE 3000

ENTRYPOINT [ "yarn", "start" ]