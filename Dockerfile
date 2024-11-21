FROM node:18-alpine
ENV WORKDIR /castle-app/
WORKDIR $WORKDIR
RUN mkdir -p $WORKDIR
COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .
RUN yarn install --frozen-lockfile
COPY src/ src/
RUN yarn tsc
EXPOSE 8080
CMD node ./dist/src/application/index.js