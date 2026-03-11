import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Tracker from './pages/Tracker';
import EasyGrows from './pages/EasyGrows';
import About from './pages/About';
import Zones from './pages/Zones';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="page-wrapper">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tracker" element={<Tracker />} />
            <Route path="/easy-grows" element={<EasyGrows />} />
            <Route path="/about" element={<About />} />
            <Route path="/zones" element={<Zones />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
