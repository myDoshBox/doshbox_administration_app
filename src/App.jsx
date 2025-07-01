// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './pages/Dashboard/AdminDashBoard';
import AddMediator from './pages/AddUsersFormPage/AddMediator';
import GetAllMediators from './pages/FetchAllInfo/AllMediatorsInfo';
import Navbar from './component/NavBar'; // if you have a navbar

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/add-mediators" element={<AddMediator />} />
        <Route path="/get-all-mediators" element={<GetAllMediators />} />
        <Route path="*" element={<Navigate to="/" />} /> {/* Catch-all */}
      </Routes>
    </Router>
  );
}

export default App;
