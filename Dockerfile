FROM node:18

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm config set engine-strict false
RUN npm install --force
RUN npm install -g serve

COPY . .

RUN npm run build

RUN echo 'OK' > /app/dist/health_check.html \
  && ln -s /app/dist/health_check.html /app/dist/health_check

EXPOSE 8080

CMD ["npm","run", "start"]
