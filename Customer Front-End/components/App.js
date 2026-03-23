import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import CustomerDashboard from './CustomerDashboard';

function App() {
  const currentUser = null; 

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/browse" element={
            currentUser?.role === 'Standard' ? <CustomerDashboard /> : <Navigate to="/" />
          } 
        />
      </Routes>
    </Router>
  );
}
export default App;