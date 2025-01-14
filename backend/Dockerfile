ARG PYTHON_VERSION=3.8.19-slim

FROM python:${PYTHON_VERSION}

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN mkdir -p /code

WORKDIR /code

RUN apt-get update && \
    apt-get install -y gcc make git && \
    rm -rf /var/lib/apt/lists/*

RUN apt-get update && apt-get install -y ffmpeg

RUN pip install Cython
RUN pip install numpy==1.23.5
COPY Makefile .

COPY requirements.txt /tmp/requirements.txt
RUN set -ex && \
    pip install --upgrade pip && \
    pip install -r /tmp/requirements.txt && \
    rm -rf /root/.cache/
COPY . /code

EXPOSE 8000

CMD ["gunicorn","--bind",":8000","--workers","1","backend.wsgi"]
