import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/Dashboard/AdminDashBoard";
import AddMediator from "./pages/AddUsersFormPage.jsx/AddMediator";
import Navbar from "./componet/NavBar";

function App() {
  return (
    <Router>
      <Navbar /> {/* ✅ This makes it visible on all pages */}
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/add-mediators" element={<AddMediator />} />
      </Routes>
    </Router>
  );
}

export default App;
