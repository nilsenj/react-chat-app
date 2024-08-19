import React, {useEffect} from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes, useNavigate} from 'react-router-dom';
import Login from './components/login/Login';
import Register from './components/register/Register';
import Profile from './components/Profile/Profile';
import userStore from './stores/UserStore';
import NotFound from './components/common/NotFound';
import Main from "./components/main/Main";
import PrivateRoute from "./components/common/PrivateRoute";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/register" element={<Register/>}/>
                <Route path="/login" element={<Login/>}/>
                {/* Private Routes */}
                <Route path="/chat" element={<PrivateRoute />}>
                    <Route path="" element={<Main />} />
                </Route>
                <Route path="/profile" element={<PrivateRoute />}>
                    <Route path="" element={<Profile />} />
                </Route>

                <Route
                    path="/"
                    element={userStore.user ? <Navigate to="/chat"/> : <Navigate to="/login"/>}
                />
                <Route path="*" element={<NotFound/>}/>
            </Routes>
        </Router>
    );
};

export default App;
