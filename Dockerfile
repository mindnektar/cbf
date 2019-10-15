FROM node:11.14.0-alpine as webpack

LABEL maintainer="Martin Denk <ausdenk@gmail.com>"

# Add Tini and bash
RUN apk add --no-cache tini bash busybox-extras python build-base git openssh-client gettext

ENV NODE_PATH /app/node_modules
ENV PATH $NODE_PATH/.bin:$PATH

WORKDIR /app/shared
COPY --chown=node:node shared/package.json /app/shared/package.json
RUN npm install
COPY --chown=node:node shared .
WORKDIR /app/client
COPY --chown=node:node client/package.json /app/client/package.json
COPY --chown=node:node .ssh/id_rsa /tmp/id_rsa
RUN \
    chmod 600 /tmp/id_rsa && \
    eval $(ssh-agent) && \
    echo -e "StrictHostKeyChecking no" >> /etc/ssh/ssh_config && \
    ssh-add /tmp/id_rsa && \
    npm install
COPY --chown=node:node client .
RUN node_modules/.bin/webpack --config webpack.config.prod.js
WORKDIR /app/server
COPY --chown=node:node server/package.json /app/server/package.json
RUN npm install
COPY --chown=node:node server .
RUN chmod a+x ./docker-entrypoint.sh

EXPOSE $PORT
ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["npm", "start"]
