FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build # Ensure you have a build script in package.json
EXPOSE 3000
CMD ["node", "dist/index.js"]