import { Routes, Route } from 'react-router-dom';
import Overview from './pages/Overview.jsx';
import AddEntry from './pages/AddEntry.jsx';
import EditEntry from './pages/EditEntry.jsx';
import Visual from './pages/Visual.jsx';
import Detail from './pages/Detail.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Overview/>}/>
      <Route path="/add-entry" element={<AddEntry/>}/>
      <Route path="/edit-entry/:id" element={<EditEntry/>}/>
      <Route path="/visual" element={<Visual/>}/>
      <Route path="/detail" element={<Detail/>}/>
    </Routes>
  );
}
