import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { observer } from 'mobx-react';
import userStore from '../../stores/UserStore';

const AuthenticatedRoute = observer(({ element: Component, ...rest }) => {
    return (
        <Route
            {...rest}
            element={userStore.user ? <Component {...rest} /> : <Navigate to="/login" />}
        />
    );
});

export default AuthenticatedRoute;
