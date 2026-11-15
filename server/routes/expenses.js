const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM expenses ORDER BY expense_date DESC"
        );

        res.json(result.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Unable to retrieve expenses" });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, category, expense_date, description } = req.body;

        const result = await pool.query(
            `UPDATE expenses
             SET amount = $1,
                 category = $2,
                 expense_date = $3,
                 description = $4
             WHERE expense_id = $5
             RETURNING *`,
            [amount, category, expense_date, description, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Expense not found" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Unable to update expense" });
    }
});

module.exports = router;