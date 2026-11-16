import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
import { getExpenses } from '../api.js';
import { money, padding } from '../utils.js';
import '../index.css';



export default function Overview() {
  const navigate = useNavigate();
  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${padding(now.getMonth() + 1)}`;

  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState('');
  //the month is kept as text like "2026-11"
  const [selectedMonth, setSelectedMonth] = useState(thisMonth);

  //split "2026-11" into year 2026 and month 11
  const year = Number(selectedMonth.slice(0, 4));
  const month = Number(selectedMonth.slice(5, 7));
  const daysInMonth = new Date(year, month, 0).getDate();

  //for the current month, the daily average only counts days that have happened so far
  let daysCounted = daysInMonth;
  if (selectedMonth === thisMonth) {
    daysCounted = now.getDate();
  }

  //load the expenses again whenever the month changes
  useEffect(() => {
    const from = `${selectedMonth}-01`;
    const to = `${selectedMonth}-${padding(daysInMonth)}`;
    getExpenses(from, to).then(setExpenses).catch((e) => setError(e.message));
  }, [selectedMonth, daysInMonth]);

  //move to the previous month (-1) or next month (+1)
  const shiftMonth = (change) => {
    const d = new Date(year, month - 1 + change, 1);
    setSelectedMonth(`${d.getFullYear()}-${padding(d.getMonth() + 1)}`);
  };

  //for typing in the month box
  const handleMonthInput = (e) => {
    if (e.target.value) {
      setSelectedMonth(e.target.value);
    }
  };

  let totalSpending = 0;
  for (const e of expenses) {
    totalSpending += e.amount;
  }
  const avgDaily = totalSpending / daysCounted;

  //group by category
  const categorizedExpenses = {};
  for (const e of expenses) {
    if (!categorizedExpenses[e.category]) {
      categorizedExpenses[e.category] = [];
    }
    categorizedExpenses[e.category].push(e);
  }
  const categoryNames = Object.keys(categorizedExpenses).sort();

  return (
    <div>
      <Header />
        <div className="overview">
          <h2>Monthly Overview</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}

          <div className="month-selection">
            <button onClick={() => shiftMonth(-1)} title="Previous month">&lt;</button>{' '}
            <label>Select Month: </label>
            <input type="month" value={selectedMonth} onChange={handleMonthInput} />{' '}
            <button onClick={() => shiftMonth(1)} title="Next month">&gt;</button>
          </div>

          <div className="summary">
            <h3>Total Spending</h3>
            <h2>{money(totalSpending)}</h2>
            <h3>Avg Daily</h3>
            <h2>{money(avgDaily)}</h2>
          </div>

          <h3>Expenses by Category</h3>

          {categoryNames.length === 0 ? (
            <p>No expenses found for this month.</p>
          ) : (
            categoryNames.map((category) => (
              <div className="category-section" key={category}>
                <h3>{category}</h3>

                {categorizedExpenses[category].map((e) => (
                  <div className="expense-item" key={e.id}>
                    <div>
                      <strong>{money(e.amount)}</strong>
                      <p>{e.description || 'No description'}</p>
                    </div>

                    <div className="expense-actions">
                      <span>{e.expense_date}</span>
                      <button onClick={() => navigate(`/edit-entry/${e.id}`)}>Edit</button>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
  );
}
