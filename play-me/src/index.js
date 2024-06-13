import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from './Components/UserContext/UserContext.js';


import './index.css';
import LandingPage from './Pages/Home/LandingPage';
import Times from './Pages/Times/Times';
import Login from './Pages/Login/Login';
import PaginaUsuario from './Pages/PaginaUsuario/PaginaUsuario';
import MinhaConta from './Pages/MinhaConta/MinhaConta.js';
import ProtectedRoute from './Components/UserContext/ProtectedRoute';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/Times' element={<Times />} />
          <Route path='/Login' element={<Login />} />
          <Route path='/MinhaConta' element={<ProtectedRoute><MinhaConta /></ProtectedRoute>} />
          <Route path='/PaginaUsuario' element={<ProtectedRoute><PaginaUsuario /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  </React.StrictMode>
);
