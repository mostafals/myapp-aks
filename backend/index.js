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

// Route GET /
app.get('/', (req, res) => {
  res.json({ message: 'API fonctionne !' });
});

// Route GET /users ET /api/users
app.get(['/users', '/api/users'], async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query`SELECT * FROM users`;
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('Backend running on port 3000'));