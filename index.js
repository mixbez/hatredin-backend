const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const dbPath = __dirname + '/db.json';
let db = fs.existsSync(dbPath) ? JSON.parse(fs.readFileSync(dbPath)) : {};

app.post('/report', (req, res) => {
  const { postId } = req.body;
  if (!postId) return res.status(400).json({ error: 'Missing postId' });

  db[postId] = (db[postId] || 0) + 1;
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  res.json({ count: db[postId] });
});

app.post('/unreport', (req, res) => {
  const { postId } = req.body;
  if (!postId) return res.status(400).json({ error: 'Missing postId' });

  if (db[postId]) {
    db[postId] -= 1;
    if (db[postId] <= 0) {
      delete db[postId];
    }
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  }

  res.json({ count: db[postId] || 0 });
});

app.get('/count/:postId', (req, res) => {
  const count = db[req.params.postId] || 0;
  res.json({ count });
});

app.listen(PORT, () => {
  console.log(`HatredIn backend running on http://localhost:${PORT}`);
});
