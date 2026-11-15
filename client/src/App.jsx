import { useState } from "react";
import Overview from "./pages/Overview";
import UpdateEntry from "./pages/UpdateEntry";
import "./App.css";

function App() {
  const [currentView, setCurrentView] = useState("overview");
  const [selectedExpense, setSelectedExpense] = useState(null);

  const handleEdit = (expense) => {
    setSelectedExpense(expense);
    setCurrentView("update");
  };

  const handleUpdated = () => {
    setSelectedExpense(null);
    setCurrentView("overview");
  };

  return (
    <div className="app">
      <header>
        <h1>Expense Tracker</h1>

        <nav>
          <button onClick={() => setCurrentView("overview")}>
            Overview
          </button>
        </nav>
      </header>

      <main>
        {currentView === "overview" && (
          <Overview onEdit={handleEdit} />
        )}

        {currentView === "update" && selectedExpense && (
          <UpdateEntry
            expense={selectedExpense}
            onCancel={() => setCurrentView("overview")}
            onUpdated={handleUpdated}
          />
        )}
      </main>
    </div>
  );
}

export default App;