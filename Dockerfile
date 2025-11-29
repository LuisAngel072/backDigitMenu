# ----------------------------
# Etapa 1: Construcción (Build)
# ----------------------------
# 
FROM node:20-alpine as build

WORKDIR /usr/src/app

# Copiamos package.json
COPY package*.json ./

# Instalamos TODAS las dependencias
RUN npm install

# Copiamos el código
COPY . .

# Compilamos
RUN npm run build

# ----------------------------
# Etapa 2: Producción
# ----------------------------
FROM node:20-alpine

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY package*.json ./

# Instalamos solo dependencias de producción
RUN npm install --only=production
# Copiamos los archivos compilados desde la etapa de construcción
COPY --from=build /usr/src/app/dist ./dist

RUN mkdir -p uploads

EXPOSE 3050

CMD ["node", "dist/src/main"]