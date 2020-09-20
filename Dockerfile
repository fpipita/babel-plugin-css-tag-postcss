FROM node:buster
ENV LANG en_US.UTF-8

RUN apt-get update \
  && apt-get install -y bash-completion locales vim \
  && cp -a /etc/skel/. /root/ \
  && echo "en_US.UTF-8 UTF-8" >> /etc/locale.gen \
  && locale-gen
