import React from 'react';
import { observer } from 'mobx-react';
import userStore from '../../stores/UserStore';

const Logout = observer(() => {
    const handleLogout = () => {
        userStore.logout();
    };

    return (
        <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded">
            Logout
        </button>
    );
});

export default Logout;
