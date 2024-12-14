FROM node:20-alpine AS BUILDER-BACK

WORKDIR /api-app
COPY . /api-app/

RUN yarn install
RUN yarn build

FROM node:20-alpine AS production

RUN apk add --no-cache openssl libssl3 libc6-compat

WORKDIR /api
COPY --from=BUILDER-BACK /api-app/node_modules /api/node_modules
COPY --from=BUILDER-BACK /api-app/dist /api/dist
COPY --from=BUILDER-BACK /api-app/package.json /api/package.json
COPY --from=BUILDER-BACK /api-app/prisma /api/prisma
COPY --from=BUILDER-BACK /api-app/data /api-app/data

RUN mkdir -p /api/data && if [ -d "/api-app/data" ]; then cp -r /api-app/data/* /api/data/; else echo "No data files found in build context. Skipping."; fi

CMD yarn start