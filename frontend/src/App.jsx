// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/Auth/Signup';
import Login from './pages/Auth/Login';
import Navbar from './components/Navbar';
import OrderHere from './pages/OrderHere';
import OrderForm from './pages/OrderForm';
import UserManagement from './pages/UserManagement';
import MyOrder from './pages/MyOrder';
import AllOrderAdmin from './pages/AllOrderAdmin';
import AllOrderWasherman from './pages/AllOrderWasherman';
import Profile from './pages/Profile';
import ManagePrices from './pages/ManagePrices';
import WashermanManagement from './pages/washermanManagement';
import { useAuth } from './context/AuthContext'; // Add this import
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { role,user } = useAuth(); // Get role from context

  return (
    <>
      <Navbar user={user} role={role} />
      <Routes>
        {/* Public Routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/washerman-management"
          element={
            <ProtectedRoute>
              {(role === 'user' && user.isAdmin) ? <WashermanManagement /> : <Navigate to="/" />}
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/washing-orders"
          element={
            <ProtectedRoute>
              {(role === 'washerman' && user.isApproved) ? <AllOrderWasherman /> : <Navigate to="/" />}
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-prices"
          element={
            <ProtectedRoute>
              {(role === 'washerman' && user.isApproved) ? <ManagePrices /> : <Navigate to="/" />}
            </ProtectedRoute>
          }
        />
        <Route
          path="/all-orders"
          element={
            <ProtectedRoute>
              {(role === 'user' && user.isAdmin) ? <AllOrderAdmin /> : <Navigate to="/" />}
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-management"
          element={
            <ProtectedRoute>
              {(role === 'user' && user.isAdmin) ? <UserManagement /> : <Navigate to="/" />}
            </ProtectedRoute>
          }
        />
        <Route path="/order" element={<ProtectedRoute><OrderHere /></ProtectedRoute>} />
        <Route path="/order/:id" element={<ProtectedRoute><OrderForm /></ProtectedRoute>} />
        <Route path="/my-orders" element={<ProtectedRoute><MyOrder /></ProtectedRoute>} />
        {/* Fallback */}
        <Route
          path="*"
          element={
            <Navigate
              to={localStorage.getItem('token') ? '/' : '/login'}
              replace
            />
          }
        />
      </Routes>
    </>
  );
}

export default App;
