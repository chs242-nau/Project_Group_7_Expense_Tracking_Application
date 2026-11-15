const express = require("express");
const cors = require("cors");
const pool = require("./db");
const expensesRouter = require("./routes/expenses");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/expenses", expensesRouter);

app.get("/", (req, res) => {
    res.send("Expense Tracker API is running");
});

app.get("/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Database connection failed");
    }
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});