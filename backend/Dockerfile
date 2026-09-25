FROM node:20-alpine

WORKDIR /app

# Installer les dépendances (couche mise en cache tant que package*.json ne change pas)
COPY package*.json ./
RUN npm install

# Copier le reste du code
COPY . .

EXPOSE 3001

CMD ["npm", "run", "dev"]