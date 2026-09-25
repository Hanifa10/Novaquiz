FROM node:20-alpine

WORKDIR /app

# Installer les dépendances (couche mise en cache tant que package*.json ne change pas)
COPY package*.json ./
RUN npm install

# Copier le reste du code
COPY . .

EXPOSE 5173

# --host est nécessaire pour que Vite soit accessible depuis l'extérieur du conteneur
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]