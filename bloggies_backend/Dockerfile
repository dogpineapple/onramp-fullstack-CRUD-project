FROM postgres:13-alpine
COPY ./src/data.sql /docker-entrypoint-initdb.d/
ENV POSTGRES_PASSWORD password