// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/Auth/Signup';
import Login from './pages/Auth/Login';
import Home from './pages/home';
import ProtectedRoute from './components/protectedRoute';

function App() {
  return (
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
  );
}

export default App;
