FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm config set engine-strict false
RUN npm install --force
COPY . .
RUN npm run build
RUN echo 'OK' > /app/dist/health_check.html
RUN ln -s /app/dist/health_check.html /app/dist/health_check
EXPOSE 5173
CMD ["serve", "-s", "dist", "-l", "5173"]
