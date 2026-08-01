import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import ProjectDetails from './pages/ProjectDetails';
import Ecommerce from './pages/Ecommerce';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Contact from './pages/Contact';
import { Toaster } from 'react-hot-toast';
import './index.css';

function App() {
  return (
    <Router>
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/project/:id" element={<ProjectDetails />} />
        <Route path="/ecommerce" element={<Ecommerce />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}

export default App;
