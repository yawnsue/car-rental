import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import CustomerDashboard from "./components/CustomerDashboard";
import MyTripsPage from "./components/MyTripsPage";
import BrowseVehiclesPage from "./components/BrowseVehiclesPage";
import VehicleDetailsPage from "./components/VehicleDetailsPage";
import ReservationPage from "./components/ReservationPage";
import ReservationsOverviewPage from "./components/ReservationsOverviewPage";
import TripDetailsPage from "./components/TripDetailsPage";
import AccountPage from "./components/AccountPage";
import AdminDashboard from './components/AdminDashboard'; // IDonovan added this import

{
  /* 
    TEMP. ROUTING SETUP
    I disabled route protection for front-end UI Dev.
    Whoever's doing backend / authentication integration
    can add protected routes and redirect logic back here.
  */
}

// Redirects to login if no token is found
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function App()
{
  const currentUser = null;// Idonovan added this because locally it would force the login screen first  
  return (
    <Router basename="/car-rental">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/browse" element={<ProtectedRoute><CustomerDashboard /></ProtectedRoute>} />
        <Route path="/trips" element={<ProtectedRoute><MyTripsPage /></ProtectedRoute>} />
        <Route path="/vehicles" element={<ProtectedRoute><BrowseVehiclesPage /></ProtectedRoute>} />
        <Route path="/vehicles/:vehicleId" element={<ProtectedRoute><VehicleDetailsPage /></ProtectedRoute>} />
        <Route path="/reservations/:vehicleId" element={<ProtectedRoute><ReservationPage /></ProtectedRoute>} />
        <Route path="/reservations" element={<ProtectedRoute><ReservationsOverviewPage /></ProtectedRoute>} />
        <Route path="/trip-details/:tripId" element={<ProtectedRoute><TripDetailsPage /></ProtectedRoute>} />
        <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
