import React from 'react';
import './App.css';
import './animations.css';
import { BrowserRouter } from 'react-router-dom';
import PublicRoutes from './PublicRoutes';
import 'bootstrap/dist/css/bootstrap.min.css';

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
