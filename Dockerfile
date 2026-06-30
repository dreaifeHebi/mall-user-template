FROM node:20-bullseye AS build

WORKDIR /app

ARG VITE_API_BASE_URL=/portal
ARG VITE_FRONTEND_BASE_URL=/
ARG VITE_BACKEND_BASE_URL=/
ARG VITE_PROXY_TARGET=http://mall-portal:8085
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_FRONTEND_BASE_URL=${VITE_FRONTEND_BASE_URL}
ENV VITE_BACKEND_BASE_URL=${VITE_BACKEND_BASE_URL}
ENV VITE_PROXY_TARGET=${VITE_PROXY_TARGET}

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27-alpine

COPY deployment/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
RUN chmod -R a+rX /usr/share/nginx/html

EXPOSE 80
