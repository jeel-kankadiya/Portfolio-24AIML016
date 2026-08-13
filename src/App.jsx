import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar   from './components/Navbar';
import Footer   from './components/Footer';

import Home     from './pages/Home';
import Projects from './pages/Projects';
import Contact  from './pages/Contact';
import NotFound from './pages/NotFound';

function App() {
  const [dark, setDark] = useState(false);

  const toggleTheme = () => setDark((d) => !d);

  return (
    <div data-theme={dark ? 'dark' : 'light'}>
      {/* Decorative background blobs */}
      <div className="blob-bg" aria-hidden="true">
        <span /><span />
      </div>

      <Navbar dark={dark} toggleTheme={toggleTheme} />

      <Routes>
        <Route path="/"         element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact"  element={<Contact />} />
        <Route path="*"         element={<NotFound />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
