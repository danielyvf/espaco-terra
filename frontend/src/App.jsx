import React from 'react';
import Dashboard from './views/Dashboard'; // Importa a sua tela do Globo
import './App.css'; // Mantém os estilos básicos

function App() {
  return (
    <div className="app-container">
      {/* Aqui estamos mandando o React renderizar a sua tela inteira */}
      <Dashboard />
    </div>
  );
}

export default App;