import './App.css';
import { Routes, Route } from 'react-router-dom';
import PaqueteDetalle from './pages/[url]';

function App() {
  return (
    <Routes>
      <Route path="/" >
        <Route path="paquetes/:url" element={<PaqueteDetalle />} />
      </Route>
    </Routes>
  );
}

export default App;