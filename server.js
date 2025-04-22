import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname and __filename equivalents
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5173;
app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, 'dist', 'index.html'); // Adjust path as necessary
    fs.readFile(indexPath, 'utf-8', (err, data) => {
      if (err) {
        return res.status(500).send('Error reading index.html');
      }
    });
  });
  app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'src')));

app.listen(PORT, () => {
  console.log(`Frontend server is running on http://localhost:${PORT}`);
});
