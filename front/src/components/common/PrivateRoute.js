import React, {useEffect} from 'react'
import {Navigate, Outlet, Route, useNavigate} from 'react-router-dom'
import authStore from "../../stores/AuthStore";

const PrivateRoute = () => {

    useEffect(() => {
        if (authStore.unauthorized) {
            authStore.resetUnauthorized(); // Reset the unauthorized state
            localStorage.removeItem('token'); // Optionally remove the token
        }
    }, [authStore.unauthorized]);

    console.log(authStore.unauthorized);
    return authStore.unauthorized ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute;