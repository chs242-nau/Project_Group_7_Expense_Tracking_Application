const express = require('express');
const router = express.Router();
const pool = require('../db');

//SQL shared by several routes: an expense plus the name of its category
const SELECT_EXPENSE = `
  SELECT e.id, e.amount, e.category_id, c.name AS category,
         e.expense_date, e.description
  FROM expenses e
  JOIN categories c ON c.id = e.category_id`;

const NEWEST_FIRST = 'ORDER BY e.expense_date DESC, e.id DESC';


function checkExpense(body) {
  const amount = Number(body.amount);
  const categoryId = parseInt(body.category_id, 10);
  if (!(amount > 0)) return 'Amount must be a positive number';
  if (!categoryId) return 'Category is required';
  return null;
}

//turns data into list of values for SQL
function expenseValues(body) {
  const description = (body.description || '').trim() || null;
  return [Number(body.amount), parseInt(body.category_id, 10), body.expense_date || null, description];
}

//if route that fails, sends back this response
function serverError(res, err) {
  console.error(err);
  res.status(500).json({ error: 'Server error' });
}

//get all expenses, or only the ones between ?from=...&to=...
router.get('/', async (req, res) => {
  try {
    const { from, to } = req.query;
    let result;
    if (from && to) {
      result = await pool.query(
        `${SELECT_EXPENSE} WHERE e.expense_date BETWEEN $1 AND $2 ${NEWEST_FIRST}`,
        [from, to]
      );
    } else {
      result = await pool.query(`${SELECT_EXPENSE} ${NEWEST_FIRST}`);
    }
    res.json(result.rows);
  } catch (err) {
    serverError(res, err);
  }
});

//get one expense for edit
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(`${SELECT_EXPENSE} WHERE e.id = $1`, [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'entry not found' });
    res.json(result.rows[0]);
  } catch (err) {
    serverError(res, err);
  }
});

//create
router.post('/', async (req, res) => {
  try {
    const problem = checkExpense(req.body);
    if (problem) return res.status(400).json({ error: problem });

    const result = await pool.query(
      `INSERT INTO expenses (amount, category_id, expense_date, description)
       VALUES ($1, $2, COALESCE($3::date, CURRENT_DATE), $4)
       RETURNING id`,
      expenseValues(req.body)
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    serverError(res, err);
  }
});

//update
router.put('/:id', async (req, res) => {
  try {
    const problem = checkExpense(req.body);
    if (problem) return res.status(400).json({ error: problem });

    const result = await pool.query(
      `UPDATE expenses
       SET amount = $1, category_id = $2,
           expense_date = COALESCE($3::date, expense_date), description = $4
       WHERE id = $5
       RETURNING id`,
      [...expenseValues(req.body), req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'entry not found' });
    res.json(result.rows[0]);
  } catch (err) {
    serverError(res, err);
  }
});

//delete
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM expenses WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'entry not found' });
    res.status(204).end();
  } catch (err) {
    serverError(res, err);
  }
});

module.exports = router;
