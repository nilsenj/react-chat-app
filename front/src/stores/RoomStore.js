import {action, makeAutoObservable} from 'mobx';
import client from '../apolloClient';
import {GET_ROOMS, GET_ROOM, GET_USER_ROOMS} from '../graphql/queries';
import { CREATE_ROOM, INVITE_USER_TO_ROOM } from '../graphql/mutations';
import authStore from "./AuthStore";

class RoomStore {
    rooms = [];
    userRooms = [];
    selectedRoom = null;
    loading = false;
    error = null;

    constructor() {
        makeAutoObservable(this, {
            fetchUserRooms: action,
            createRoom: action,
            setSelectedRoom: action,
            addRoom: action,
            setRooms: action,
            setUserRooms: action,
            setLoading: action,
            setError: action,
        });
        this.fetchUserRooms();
    }

    setRooms(rooms) {
        this.rooms = rooms;
    }

    setUserRooms(rooms) {
        this.userRooms = rooms;
    }

    setSelectedRoom(room) {
        this.selectedRoom = room;
    }

    setLoading(loading) {
        this.loading = loading;
    }

    setError(error) {
        this.error = error;
    }

    async fetchRooms() {
        this.setLoading(true);
        try {
            const response = await client.query({
                query: GET_ROOMS,
                context: {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                },
            });
            this.setRooms(response.data.getRooms);
            this.setLoading(false);
        } catch (error) {
            this.setError(error.message);
            this.setLoading(false);
            if (error.message === "Not authorized, token failed") {
                authStore.setUnauthorized(); // Update unauthorized state
            }
        }
    }

    async fetchRoom(roomId) {
        this.setLoading(true);
        try {
            const response = await client.query({
                query: GET_ROOM,
                variables: { roomId },
                context: {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                },
            });
            this.setSelectedRoom(response.data.getRoom);
            this.setLoading(false);
        } catch (error) {
            this.setError(error.message);
            this.setLoading(false);
            if (error.message === "Not authorized, token failed") {
                authStore.setUnauthorized(); // Update unauthorized state
            }
        }
    }

    async createRoom(name, users) {
        this.setLoading(true);
        try {
            const response = await client.mutate({
                mutation: CREATE_ROOM,
                variables: { name, users },
                context: {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                },
            });
            this.rooms.push(response.data.createRoom);
            this.fetchUserRooms();
            this.setLoading(false);
        } catch (error) {
            this.setError(error.message);
            this.setLoading(false);
            if (error.message === "Not authorized, token failed") {
                authStore.setUnauthorized();
            }
        }
    }

    async fetchUserRooms() {
        try {
            const response = await client.query({
                query: GET_USER_ROOMS,
            });
            this.setUserRooms(response.data.getUserRooms);
        } catch (error) {
            console.error('Failed to fetch user rooms', error);
            if (error.message === "Not authorized, token failed") {
                authStore.setUnauthorized();
            }
        }
    }

    async inviteUserToRoom(roomId, userId) {
        this.setLoading(true);
        try {
            const response = await client.mutate({
                mutation: INVITE_USER_TO_ROOM,
                variables: { roomId, userId },
                context: {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                },
            });
            this.setSelectedRoom(response.data.inviteUserToRoom);
            this.setLoading(false);
        } catch (error) {
            this.setError(error.message);
            this.setLoading(false);
            if (error.message === "Not authorized, token failed") {
                authStore.setUnauthorized(); // Update unauthorized state
            }
        }
    }

    addPostToSelectedRoom(post) {
        if (this.selectedRoom) {
            this.selectedRoom.posts.push(post);
        }
    }

    updatePostInSelectedRoom(updatedPost) {
        if (this.selectedRoom) {
            this.selectedRoom.posts = this.selectedRoom.posts.map(post =>
                post._id === updatedPost._id ? updatedPost : post
            );
        }
    }
}

const roomStore = new RoomStore();
export default roomStore;
