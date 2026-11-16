import { Link, useNavigate } from 'react-router-dom';
//header used by every page, if back=true, show a Back button instead of the navigation links
export default function Header({ back = false }) {
  const navigate = useNavigate();
  return (
    <header>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Link to="/"><strong>Expense Tracker</strong></Link>

        {back ? (
          <button onClick={() => navigate(-1)}>Back</button>
        ) : (
          <nav>
            <Link to="/add-entry">Add</Link> | <Link to="/visual">Visual (PHASE2)</Link> | <Link to="/detail">Detail</Link>
          </nav>
        )}
      </div>
      <hr />
    </header>
  );
}
