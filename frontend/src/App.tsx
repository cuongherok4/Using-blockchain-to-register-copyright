import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import NFTList from './pages/NFTList';
import SendRequest from './pages/SendRequest';
import SentRequests from './pages/SentRequests';
import Login from './pages/Login';
import TopicDetail from './pages/TopicDetail'; // Thêm import này

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );

  const updateAuthStatus = () => {
    setIsAuthenticated(localStorage.getItem('isAuthenticated') === 'true');
  };

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(localStorage.getItem('isAuthenticated') === 'true');
    };

    window.addEventListener('storage', handleStorageChange);
    handleStorageChange();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <>
      {isAuthenticated && <Navbar />}
      <Routes>
        {/* Login route */}
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/" /> : <Login updateAuthStatus={updateAuthStatus} />
          }
        />

        {/* Main routes */}
        <Route
          path="/"
          element={isAuthenticated ? <NFTList /> : <Navigate to="/login" />}
        />
        <Route
          path="/send-request"
          element={isAuthenticated ? <SendRequest /> : <Navigate to="/login" />}
        />
        <Route
          path="/sent-requests"
          element={isAuthenticated ? <SentRequests /> : <Navigate to="/login" />}
        />
        
        {/* Topic Detail route - THÊM DÒNG NÀY */}
        <Route
          path="/topic-detail/:id"
          element={isAuthenticated ? <TopicDetail /> : <Navigate to="/login" />}
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
      </Routes>
    </>
  );
}

export default App;