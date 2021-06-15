FROM node:12-alpine

COPY 00-alpine.conf /etc/sysctl.d

# pdate and install dependency
RUN apk update && apk upgrade
RUN apk add --no-cache procps

# Crea directorio de trabajo
RUN mkdir /backend
WORKDIR /backend

# copia solamente lo necesario para que el servicio funcione con docker
COPY ./src/ /backend/src/
COPY .env /backend/.env
COPY ./.babelrc /backend
COPY ./package.json /backend
#Setup cron jobs

# comandos de debug, borrar al terminar pruebas
RUN ls -la
RUN node -v
RUN npm -v

# instala solamente dependencias en modo node produccion, no baja las devDependencies
#RUN NODE_ENV=production npm install --no-optional
RUN NODE_ENV=production npm install
RUN npm audit fix


ENTRYPOINT ["sh", "-c", "npm run start"]
