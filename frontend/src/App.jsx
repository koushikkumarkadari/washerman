// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/Auth/Signup';
import Login from './pages/Auth/Login';
import Home from './pages/home';
import ProtectedRoute from './components/protectedRoute';
import Navbar from './components/Navbar';
import OrderHere from './pages/OrderHere';
import OrderForm from './pages/OrderForm';
import UserManagement from './pages/UserManagement';
import MyOrder from './pages/MyOrder';
import AllOrderAdmin from './pages/AllOrderAdmin';
import AllOrderWasherman from './pages/AllOrderWasherman';
import { useAuth } from './context/AuthContext'; // Add this import

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
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/washing-orders"
          element={
            <ProtectedRoute>
              {(role === 'washerman') ? <AllOrderWasherman /> : <Navigate to="/" />}
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
