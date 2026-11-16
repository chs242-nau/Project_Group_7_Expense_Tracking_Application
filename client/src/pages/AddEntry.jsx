import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
import EntryForm from '../components/EntryForm.jsx';
import { createExpense } from '../api.js';

export default function AddEntry() {
  const navigate = useNavigate();

  return (
    <div>
      <Header back />
      <h2>Add Entry</h2>
      <EntryForm
        onSubmit={async (data) => {
          await createExpense(data);
          navigate('/');
        }}
      />
    </div>
  );
}
