// src/components/Home.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    if (!user) {
        navigate('/login');
    }

    return (
        <div>
            <h1>Welcome, {user.email}</h1>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

export default Home;
