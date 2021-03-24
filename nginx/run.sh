#!/bin/bash -

set -o errexit

mkdir -p /run/nginx


# --- Start Insert ENV to JS bundle ---
# Remember to also update webpack.config.js, Dockerfile and config.js
echo "== Inserting env variables =="
for file in /usr/share/nginx/html/*.js
do
  echo "== ENV sub for $file =="
  sed -i 's,REPLACE_KEYCLOAK_AUTH_URL,'${KEYCLOAK_AUTH_URL}',g' $file
  sed -i 's,REPLACE_KEYCLOAK_CLIENT_ID,'${KEYCLOAK_CLIENT_ID}',g' $file
  sed -i 's,REPLACE_KEYCLOAK_REALM,'${KEYCLOAK_REALM}',g' $file
  sed -i 's,REPLACE_FORM_API_URL,'${FORM_API_URL}',g' $file
  sed -i 's,REPLACE_REFDATA_API_URL,'${REFDATA_API_URL}',g' $file
done
echo "== Finished ENV sub =="
# --- End Insert ENV to JS bundle ---


# config file takes precedence
if [[ -f ${NGINX_CONFIG_FILE} ]]; then
  echo "== Starting nginx using a config file =="
  sed -i 's,REPLACE_CERBERUS_API_URL,'${CERBERUS_API_URL}',g' ${NGINX_CONFIG_FILE}
  nginx -g 'daemon off;' -c ${NGINX_CONFIG_FILE}
elif [[ -n ${NGINX_CONFIG} ]]; then
  echo "== Starting nginx using a config variable =="
  cp -f <(echo "${NGINX_CONFIG}") /etc/nginx/nginx.conf
  nginx -g 'daemon off;' -c /etc/nginx/nginx.conf
else
  echo "== [error] Please set NGINX_CONFIG_FILE or NGINX_CONFIG variable =="
  exit 1
fi

