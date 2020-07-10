# //
# Docker container for `kraft`
# //

FROM alpine:latest

#### prerequisites
RUN apk update && \
    apk upgrade && \
    apk add nodejs npm bash

#--- get nodejs runtime
RUN npm i -g n && n stable

#--- get `forever` to run project at background
RUN npm i -g forever

#### create project dir
RUN mkdir -p /opt/kraft
WORKDIR /opt/kraft

#--- packing project
COPY file-to-dock.tar.gz /tmp/

#--- extract project
RUN tar -xvf /tmp/file-to-dock.tar.gz -C /opt/kraft/

#--- 
RUN chmod +x /opt/kraft/server.js

#### clean up
RUN rm -rf /tmp/file-to-dock.tar.gz
RUN rm -rf /opt/kraft/Dockerfile

#### set project run endpoint
ENTRYPOINT ["/opt/kraft/app.js"]
