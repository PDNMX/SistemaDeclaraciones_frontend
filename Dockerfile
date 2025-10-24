#compile
FROM node:16-alpine as builder


WORKDIR /build

# COPY package.json ./
# RUN npm install

COPY . ./
RUN yarn install
RUN yarn build --prod

#serve
FROM nginx:alpine

COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /build/dist/ /usr/share/nginx/html/
