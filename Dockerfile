FROM artifactory.corp.olacabs.com:5000/node:18

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm config set engine-strict false
RUN npm install --force
RUN npm install -g serve

COPY . .

RUN npm run build

RUN echo 'OK' > /app/dist/health_check.html

RUN echo -e "/health_check\n  Content-Type: text/plain" > /app/dist/_headers

HEALTHCHECK CMD curl -fs http://localhost:8080/health_check || exit 1

EXPOSE 8080

CMD ["npm", "run", "start"]
