import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Menu from './components/menu';
import Fase1 from './components/fase1';
import Fase2 from './components/fase2';
import Fase3 from './components/fase3';
import Fase4 from './components/fase4';
import Inicio from './components/inicio';
import Introdução from './components/introducao';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/introducao" element={<Introdução />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/fase1" element={<Fase1 />} />
        <Route path="/fase2" element={<Fase2 />} />
        <Route path="/fase3" element={<Fase3 />} />
        <Route path="/fase4" element={<Fase4 />} />
      </Routes>
    </Router>
  );
}

export default App;
