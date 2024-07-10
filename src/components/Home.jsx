import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    return (
        <div>
            {user && (
                <>
                    <h1>Welcome, {user.username}</h1>
                    <button onClick={() => {
                        logout();
                        navigate('/login');
                    }}>Logout</button>
                </>
            )}
        </div>
    );
};

export default Home;
