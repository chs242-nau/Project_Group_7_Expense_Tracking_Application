import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header.jsx';
import EntryForm from '../components/EntryForm.jsx';
import { getExpense, updateExpense } from '../api.js';

//same as AddEntry, but the form starts filled in with the existing entry
export default function EditEntry() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expense, setExpense] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getExpense(id).then(setExpense).catch((e) => setError(e.message));
  }, [id]);

  return (
    <div>
      <Header back />
      <h2>Edit Entry</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!expense && !error && <p>Loading...</p>}
      {expense && (
        <EntryForm
          initial={expense}
          submitLabel="Update"
          onCancel={() => navigate(-1)}
          onSubmit={async (data) => {
            await updateExpense(id, data);
            navigate('/detail');
          }}
        />
      )}
    </div>
  );
}
