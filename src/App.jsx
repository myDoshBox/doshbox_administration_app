import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminDashboard from './pages/Dashboard/AdminDashBoard';
import AddMediator from './pages/AddUsersFormPage/AddMediator';
import GetAllMediators from './pages/FetchAllInfo/AllMediatorsInfo';
import Navbar from './component/NavBar';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/add-mediators" element={<AddMediator />} />
        <Route path="/get-all-mediators" element={<GetAllMediators />} />
      </Routes>
    </Router>
  );
}

export default App;
