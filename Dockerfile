FROM node as build

ENV NPM_CONFIG_LOGLEVEL warn
ARG app_env
ENV APP_ENV $app_env

RUN mkdir -p /frontend
WORKDIR /frontend
COPY . .

RUN yarn build

# nginx

FROM southclaws/nginx-spa as run
COPY --from=build /frontend/build /app
EXPOSE 3000
