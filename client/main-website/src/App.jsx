import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Ecommerce from './pages/Ecommerce';
import Admin from './pages/Admin';
import Login from './pages/Login';
import { Toaster } from 'react-hot-toast';
import './index.css';

function App() {
  return (
    <Router>
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/ecommerce" element={<Ecommerce />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
