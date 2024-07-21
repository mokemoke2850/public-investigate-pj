FROM python:3.12-slim

RUN groupadd --gid 1000 docker \
    && useradd --uid 1000 --gid 1000 -m docker --shell /bin/bash

RUN mkdir /docker-env

WORKDIR /docker-env

COPY . /docker-env