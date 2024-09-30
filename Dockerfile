FROM node:20-alpine AS BUILDER-BACK

WORKDIR /api-app
COPY . /api-app/

RUN yarn install
RUN yarn build

FROM node:20-alpine AS production

WORKDIR /api
COPY --from=BUILDER-BACK /api-app/node_modules /api/node_modules
COPY --from=BUILDER-BACK /api-app/dist /api/dist
COPY --from=BUILDER-BACK /api-app/package.json /api/package.json

CMD yarn start:prod