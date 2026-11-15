import { useState } from "react";

function UpdateEntry({ expense, onCancel, onUpdated }) {
  const [amount, setAmount] = useState(expense.amount);
  const [category, setCategory] = useState(expense.category);
  const [expenseDate, setExpenseDate] = useState(
    expense.expense_date.slice(0, 10)
  );
  const [description, setDescription] = useState(
    expense.description || ""
  );

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:5000/expenses/${expense.expense_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            amount,
            category,
            expense_date: expenseDate,
            description
          })
        }
      );

      if (!response.ok) {
        throw new Error("Unable to update expense");
      }

      const updatedExpense = await response.json();

      onUpdated(updatedExpense);
    } catch (error) {
      console.error(error.message);
      alert("Unable to update expense.");
    }
  };

  return (
    <div className="update-entry">
      <h2>Update Expense</h2>

      <form onSubmit={handleSubmit}>
        <label>Amount</label>
        <input
          type="number"
          step="0.01"
          min="0.01"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          required
        />

        <label>Category</label>
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          required
        >
          <option value="Groceries">Groceries</option>
          <option value="Transportation">Transportation</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Utilities">Utilities</option>
          <option value="Food">Food</option>
          <option value="Other">Other</option>
        </select>

        <label>Date</label>
        <input
          type="date"
          value={expenseDate}
          onChange={(event) => setExpenseDate(event.target.value)}
          required
        />

        <label>Description (Optional)</label>
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />

        <div className="form-buttons">
          <button type="submit">Save Changes</button>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateEntry;