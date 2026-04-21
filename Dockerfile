# Etapa de construcción
FROM node:22-alpine AS build
WORKDIR /app

# Instalar dependencias
# Usamos --legacy-peer-deps por la compatibilidad de Astro 6 con el plugin PWA
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copiar el resto del código y construir
COPY . .
RUN npm run build

# Etapa de producción
FROM nginx:stable-alpine AS runtime

# Copiar la configuración de Nginx para soportar SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos estáticos desde la etapa de construcción
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
