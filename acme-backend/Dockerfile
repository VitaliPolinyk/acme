FROM node:12.13.0-alpine as builder

RUN apk add --no-cache --virtual .gyp python git

RUN mkdir /app && chown -R node:node /app
USER node
WORKDIR /app
COPY --chown=node:node package*.json /app/
RUN npm install --no-audit

ADD --chown=node:node . /app
RUN npm run build
RUN npm run ci:test


FROM node:12.13.0-alpine as app
COPY --chown=node:node --from=builder /app /app
RUN rm -rf /app/src && rm -rf /app/.git
USER node
WORKDIR /app
ENV NODE_ENV=production
RUN npm prune --production

ARG buildtime_cibuild=none
ENV CI_BUILD=$buildtime_cibuild
ENV appDir /app
ENV PORT 5000

EXPOSE 5000

CMD ["npm", "run", "api"]
