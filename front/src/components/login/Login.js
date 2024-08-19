import React, {useEffect, useState} from 'react';
import {observer} from 'mobx-react';
import userStore from '../../stores/UserStore';
import {useNavigate} from "react-router-dom";

const Login = observer(() => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (userStore.user) {
            navigate('/chat');
        }
    }, [userStore.user, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        await userStore.login(email, password).then(() => {
        });
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl mb-6">Login</h2>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 mb-4 border border-gray-300 rounded"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 mb-4 border border-gray-300 rounded"
                />
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
                    Login
                </button>
                {userStore.loading && <p>Loading...</p>}
                {userStore.error && <p className="text-red-500 mt-4">{userStore.error}</p>}
            </form>
        </div>
    );
});

export default Login;
