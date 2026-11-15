import { useEffect, useState } from "react";

function Overview({ onEdit }) {
  const [expenses, setExpenses] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  useEffect(() => {
    fetch("http://localhost:5000/expenses")
      .then((response) => response.json())
      .then((data) => setExpenses(data))
      .catch((error) => console.error("Error fetching expenses:", error));
  }, []);

  const monthlyExpenses = expenses.filter((expense) => {
    return expense.expense_date.slice(0, 7) === selectedMonth;
  });

  const totalSpending = monthlyExpenses.reduce(
    (total, expense) => total + Number(expense.amount),
    0
  );

  const categorizedExpenses = monthlyExpenses.reduce((categories, expense) => {
    const category = expense.category;

    if (!categories[category]) {
      categories[category] = [];
    }

    categories[category].push(expense);

    return categories;
  }, {});

  return (
    <div className="overview">
      <h2>Monthly Overview</h2>

      <div className="month-selection">
        <label>Select Month: </label>
        <input
          type="month"
          value={selectedMonth}
          onChange={(event) => setSelectedMonth(event.target.value)}
        />
      </div>

      <div className="summary">
        <h3>Total Spending</h3>
        <h2>${totalSpending.toFixed(2)}</h2>
      </div>

      <h3>Expenses by Category</h3>

      {Object.keys(categorizedExpenses).length === 0 ? (
        <p>No expenses found for this month.</p>
      ) : (
        Object.entries(categorizedExpenses).map(([category, entries]) => (
          <div className="category-section" key={category}>
            <h3>{category}</h3>

            {entries.map((expense) => (
              <div className="expense-item" key={expense.expense_id}>
                <div>
                    <strong>${Number(expense.amount).toFixed(2)}</strong>
                    <p>{expense.description || "No description"}</p>
                </div>

                <div className="expense-actions">
                    <span>
                        {new Date(expense.expense_date).toLocaleDateString()}
                    </span>

                    <button onClick={() => onEdit(expense)}>
                        Edit
                    </button>
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}

export default Overview;