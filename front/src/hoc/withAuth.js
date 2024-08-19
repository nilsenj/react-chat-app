import React from 'react';
import {Navigate} from 'react-router-dom';
import {observer} from 'mobx-react';
import userStore from '../stores/UserStore';

const withAuth = (WrappedComponent) => {
    return observer((props) => {
        if (!userStore.user) {
            return <Navigate to="/login"/>;
        }

        return <WrappedComponent {...props} />;
    });
};

export default withAuth;
