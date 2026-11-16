import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header.jsx';
import { getExpenses, deleteExpense } from '../api.js';
import { money } from '../utils.js';

export default function Detail() {
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState('');

  const loadExpenses = () => {
    getExpenses().then(setExpenses).catch((e) => setError(e.message));
  };


  useEffect(loadExpenses, []);

  const remove = async (id) => {
    if (!window.confirm('Delete?')) return;
    try {
      await deleteExpense(id);
      loadExpenses(); //reload the list to reflect deleted entry
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div>
      <Header />
      <h2>Detailed View</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <table border="1" cellPadding="4">
        <thead>
          <tr>
            <th>#</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Date</th>
            <th>Description</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>

        <tbody>
          {expenses.map((e, i) => (
            <tr key={e.id}>
              <td>{i + 1}</td>
              <td>{money(e.amount)}</td>
              <td>{e.category}</td>
              <td>{e.expense_date}</td>
              <td>{e.description}</td>
              <td><Link to={`/edit-entry/${e.id}`} title="Edit">Edit</Link></td>
              <td><button onClick={() => remove(e.id)} title="Delete">X</button></td>
            </tr>
          ))}
          {expenses.length === 0 && (
            <tr><td colSpan="7">No entries yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
