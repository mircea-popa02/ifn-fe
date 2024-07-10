import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Login from './components/Login';
import Home from './components/Home';
import { defaultTheme, Provider } from '@adobe/react-spectrum';

const App = () => {
  return (
    <Provider theme={defaultTheme}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </Router>
      </AuthProvider>
    </Provider>
  );
};

export default App;
