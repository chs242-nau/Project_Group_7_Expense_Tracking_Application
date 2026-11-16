const express = require('express');
const pool = require('./db');
const expensesRouter = require('./routes/expenses');
const categoriesRouter = require('./routes/categories');

const app = express();
app.use(express.json());

app.use('/api/expenses', expensesRouter);
app.use('/api/categories', categoriesRouter);

app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
