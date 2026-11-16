import { useEffect, useState } from 'react';
import { getCategories, createCategory } from '../api.js';

//component because both AddEntry and EditEntry use it.
//onCancel is optional. When it is true a cancel button is shown.
export default function EntryForm({ initial, onSubmit, onCancel, submitLabel = 'Submit' }) {
  const [categories, setCategories] = useState([]);
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [error, setError] = useState('');

  //load the category list when the form first appears
  useEffect(() => {
    getCategories().then(setCategories).catch((e) => setError(e.message));
  }, []);

  //when editing, fill the form with the existing entry
  useEffect(() => {
    if (!initial) return;
    setAmount(initial.amount);
    setCategoryId(String(initial.category_id));
    setDescription(initial.description || '');
    setDate(initial.expense_date);
  }, [initial]);

  //add a new category (a phase 2 feature, but it was easy enough to do now)
  const addCategory = async () => {
    const name = newName.trim();
    if (!name) return;
    try {
      const cat = await createCategory(name);
      const list = await getCategories();
      setCategories(list);
      setCategoryId(String(cat.id));
      setNewName('');
      setShowNew(false);
      setError('');
    } catch (e) {
      setError(e.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await onSubmit({
        amount,
        category_id: categoryId,
        expense_date: date || null,
        description: description || null,
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <p>
        <label>
          Amount: <input type="number" step="0.01" min="0.01" required value={amount}
            onChange={(e) => setAmount(e.target.value)} />
        </label>
      </p>

      <p>
        <label>
          Category:{' '}
          <select required value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="">-- select --</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </label>{' '}
        <button type="button" onClick={() => setShowNew(!showNew)}>+ New Category</button>
      </p>

      {showNew && (
        <p>
          <input
            placeholder="New category name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addCategory();
              }
            }}
          />{' '}
          <button type="button" onClick={addCategory}>Save Category</button>
        </p>
      )}

      <p>
        <label>
          Description (optional):<br />
          <textarea rows="3" value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
      </p>

      <p>
        <label>
          Date (optional, defaults to today):{' '}
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
      </p>

      <button type="submit">{submitLabel}</button>
      {onCancel && (
        <>
          {' '}
          <button type="button" onClick={onCancel}>Cancel</button>
        </>
      )}
      {error && <p style={{color: 'red'}}>{error}</p>}
    </form>
  );
}
