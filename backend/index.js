const express = require('express');
const sql = require('mssql');

const app = express();
app.use(express.json());

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: 'srv-mabase.database.windows.net',
  database: 'mabase',
  port: 1433,
  options: {
    encrypt: true,
    trustServerCertificate: false
  }
};

// Connexion DB
async function getDB() {
  return await sql.connect(config);
}

// GET toutes les tâches
app.get('/tasks', async (req, res) => {
  try {
    await getDB();
    const result = await sql.query`SELECT * FROM tasks ORDER BY created_at DESC`;
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST nouvelle tâche
app.post('/tasks', async (req, res) => {
  try {
    const { title } = req.body;
    await getDB();
    await sql.query`INSERT INTO tasks (title) VALUES (${title})`;
    res.json({ message: 'Tâche créée !' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT modifier tâche (completed)
app.put('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;
    await getDB();
    await sql.query`UPDATE tasks SET completed = ${completed} WHERE id = ${id}`;
    res.json({ message: 'Tâche mise à jour !' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE supprimer tâche
app.delete('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await getDB();
    await sql.query`DELETE FROM tasks WHERE id = ${id}`;
    res.json({ message: 'Tâche supprimée !' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('Backend running on port 3000'));