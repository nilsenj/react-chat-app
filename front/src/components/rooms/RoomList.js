import { Fragment, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import roomStore from '../../stores/RoomStore';
import userStore from '../../stores/UserStore';
import { Dialog, Switch, Transition } from '@headlessui/react';
import { FaPlus } from 'react-icons/fa';

const RoomList = observer(() => {
    const [isOpen, setIsOpen] = useState(false);
    const [roomName, setRoomName] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);

    useEffect(() => {
        roomStore.fetchUserRooms(); // Fetch rooms
        userStore.fetchAllUsers(); // Fetch users
    }, []);

    const handleCreateRoom = async () => {
        await roomStore.createRoom(roomName, selectedUsers);
        setIsOpen(false);
        setRoomName('');
        setSelectedUsers([]);
    };

    const toggleUserSelection = (userId) => {
        if (selectedUsers.includes(userId)) {
            setSelectedUsers(selectedUsers.filter(id => id !== userId));
        } else {
            setSelectedUsers([...selectedUsers, userId]);
        }
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    const openModal = () => {
        setIsOpen(true);
    };

    return (
        <div className="w-1/4 bg-gray-100 p-4 h-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Rooms</h2>
                <button onClick={openModal} className="text-blue-500">
                    <FaPlus size={20} />
                </button>
            </div>
            <ul>
                {roomStore?.userRooms?.map(room => (
                    <li key={room._id} className="mb-2">
                        <button
                            onClick={() => roomStore?.setSelectedRoom(room)}
                            className="text-left w-full px-4 py-2 bg-white rounded shadow"
                        >
                            {room?.name}
                        </button>
                    </li>
                ))}
            </ul>

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel
                                    className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                        Create Room
                                    </Dialog.Title>
                                    <div className="mt-4">
                                        <input
                                            type="text"
                                            placeholder="Room Name"
                                            value={roomName}
                                            onChange={(e) => setRoomName(e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded mb-4"
                                        />
                                        <div className="mb-4">
                                            <h3 className="font-semibold mb-2">Invite Users</h3>
                                            <ul className="max-h-32 overflow-y-auto">
                                                {userStore?.users?.map(user => (
                                                    <li key={user._id} className="flex items-center mb-2">
                                                        <Switch
                                                            checked={selectedUsers.includes(user._id)}
                                                            onChange={() => toggleUserSelection(user._id)}
                                                            className={`${
                                                                selectedUsers.includes(user._id) ? 'bg-blue-600' : 'bg-gray-200'
                                                            } relative inline-flex h-6 w-11 items-center rounded-full`}
                                                        >
                                                            <span className="sr-only">{user?.username}</span>
                                                            <span
                                                                className={`${
                                                                    selectedUsers.includes(user._id) ? 'translate-x-6' : 'translate-x-1'
                                                                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                                                            />
                                                        </Switch>
                                                        <span
                                                            className={`ml-3 text-sm text-gray-700 ${selectedUsers.includes(user._id) ? 'font-bold' : ''}`}>
                                                            {user?.username}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <button
                                            onClick={handleCreateRoom}
                                            className="w-full bg-blue-500 text-white p-2 rounded"
                                        >
                                            Create Room
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
});

export default RoomList;
