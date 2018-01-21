FROM node as build

ENV NPM_CONFIG_LOGLEVEL warn
ARG app_env
ENV APP_ENV $app_env

RUN mkdir -p /frontend
WORKDIR /frontend
COPY . .

RUN npm install && npm run build

# nginx

FROM m31271n/nginx-spa as run
COPY --from=build /frontend/build /app
EXPOSE 80
