FROM node:12
ADD . /workspace
WORKDIR /workspace
RUN yarn
RUN yarn build
