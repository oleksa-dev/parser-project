FROM node:11.7 AS build

# Copying necessary folders and files
# Install  dependencies
COPY package.json .
COPY package-lock.json .
COPY index.js .

COPY config config
COPY controller controller
COPY model model
COPY parser parser
COPY public public
COPY routs routs
COPY view view
RUN npm install --production

FROM node:11.7-alpine
# Create app directory
RUN mkdir /app
WORKDIR /app
COPY --from=build config config
COPY --from=build package.json package.json
COPY --from=build package-lock.json package-lock.json
COPY --from=build index.js index.js
COPY --from=build config config
COPY --from=build controller controller
COPY --from=build model model
COPY --from=build node_modules node_modules
COPY --from=build parser parser
COPY --from=build public public
COPY --from=build routs routs
COPY --from=build view view

EXPOSE 4000
CMD MONGO_HOST=parser_mongo node index.js
