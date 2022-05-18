#compile
FROM node:lts-buster as builder

WORKDIR /build

# COPY package.json ./
# RUN npm install

COPY . ./
RUN npm install
RUN npm run build --prod

#serve
FROM nginx:alpine

COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /build/dist/ /usr/share/nginx/html/
