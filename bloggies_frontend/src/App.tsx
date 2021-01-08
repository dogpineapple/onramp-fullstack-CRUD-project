import React from 'react';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import PublicRoutes from './PublicRoutes';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <PublicRoutes />
      </BrowserRouter>
    </div>
  );
}

export default App;
