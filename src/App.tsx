import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import EditorPage from './pages/Editor';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/editor" />} />
        <Route path="/editor" element={<EditorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
