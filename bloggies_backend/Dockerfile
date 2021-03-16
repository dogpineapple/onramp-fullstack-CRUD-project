FROM postgres:13-alpine
COPY ./src/data.sql /docker-entrypoint-initdb.d/
ARG DB_PASSWORD=password
ENV POSTGRES_PASSWORD=${DB_PASSWORD}