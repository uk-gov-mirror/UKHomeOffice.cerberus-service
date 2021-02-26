FROM node:10-alpine as builder

ARG ENVIRONMENT=fake-environment
ARG KEYCLOAK_AUTH_URL=https://sso-fake.build.com/auth
ARG KEYCLOAK_CLIENT_ID=fake-client-id
ARG KEYCLOAK_REALM=fake-realm

RUN apk update && apk upgrade
RUN mkdir -p /src

WORKDIR /src

COPY package*.json ./
RUN npm install
COPY . /src

RUN npm run build

# Now build teh final image based on nginx
FROM alpine:3.7

ENV NGINX_CONFIG_FILE=/etc/nginx/nginx.conf \
    KEYCLOAK_AUTH_URL=https://sso-fake.build.com/auth \
    KEYCLOAK_CLIENT_ID=fake-client-id \
    KEYCLOAK_REALM=fake-realm

RUN apk upgrade --no-cache && \
    apk add --no-cache nginx bash nginx-mod-http-lua && \
    install -d -g nginx -o nginx /run/nginx && \
    chown -R nginx:nginx /etc/nginx /var/log/nginx

COPY --from=builder /src/dist/ /usr/share/nginx/html
COPY /nginx/nginx.conf /etc/nginx/nginx.conf
COPY --chown=100 /nginx/run.sh /run.sh

RUN chmod 700 /run.sh
RUN chown nginx /usr/share/nginx/html

# UID for ngnix user
USER 100

EXPOSE 8080

ENTRYPOINT ["/run.sh"]

