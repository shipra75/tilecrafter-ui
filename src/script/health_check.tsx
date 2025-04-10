import { createServer, IncomingMessage, ServerResponse } from 'http';
import * as fs from 'fs';
import * as path from 'path';

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  if (req.url === '/health_check' && req.method === 'GET') {
    console.log("here 1")
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'UP' }));
  } else { 
    console.log("here 2")
    fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  }
});

const PORT =  5173;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
