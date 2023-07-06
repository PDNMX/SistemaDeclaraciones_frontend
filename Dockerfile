#compile
FROM node:16-buster as builder

WORKDIR /build

# COPY package.json ./
# RUN npm install

COPY . ./
RUN npm install
RUN npm run build --prod
#RUN npm run try

#serve
FROM nginx:alpine

COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /build/dist/ /usr/share/nginx/html/
#COPY --from=builder /build/src /usr/share/nginx/html/
