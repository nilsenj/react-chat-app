import { useEffect } from 'react';
import { observer } from 'mobx-react';
import userStore from '../../stores/UserStore';
import Logout from '../logout/Logout';

const Profile = observer(() => {
    useEffect(() => {
        userStore.getUserProfile().then(r => {});
    }, []);

    console.log(userStore);


    if (userStore.loading) {
        return <p>Loading...</p>;
    }

    if (userStore.error) {
        return <p className="text-red-500">{userStore.error}</p>;
    }


    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl mb-6">Profile</h2>
                <p><strong>Username:</strong> {userStore.user?.username}</p>
                <p><strong>Email:</strong> {userStore.user?.email}</p>
                <p><strong>Created At:</strong> {userStore.user?.createdAt}</p>
                <Logout />
            </div>
        </div>
    );
});

export default Profile;
