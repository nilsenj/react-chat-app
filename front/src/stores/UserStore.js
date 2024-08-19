import {makeAutoObservable} from 'mobx';
import {gql} from '@apollo/client';
import client from '../apolloClient';
import {GET_ALL_USERS} from "../graphql/queries";
import authStore from "./AuthStore";

class UserStore {
    user = null;
    users = [];
    loading = false;
    error = null;

    constructor() {
        makeAutoObservable(this);
        this.loadUser();
        this.fetchAllUsers();
    }

    setUser(user) {
        this.user = user;
    }

    setUsers(users) {
        this.users = users;
    }

    setLoading(loading) {
        this.loading = loading;
    }

    setError(error) {
        this.error = error;
    }

    async loadUser() {
        const token = localStorage.getItem('token');
        if (token) {
            await this.getUserProfile();
        }
    }

    async register(username, email, password) {
        this.setLoading(true);
        try {
            const response = await client.mutate({
                mutation: gql`
          mutation RegisterUser($username: String!, $email: String!, $password: String!) {
            registerUser(username: $username, email: $email, password: $password) {
              _id
              username
              email
              createdAt
              token
            }
          }
        `,
                variables: {username, email, password}
            });
            const user = response.data.registerUser;
            localStorage.setItem('token', user.token);
            this.setUser(user);
            this.setLoading(false);
        } catch (error) {
            this.setError(error.message);
            this.setLoading(false);
            if (error.message === "Not authorized, token failed") {
                authStore.setUnauthorized(); // Update unauthorized state
            }
        }
    }

    async login(email, password) {
        this.setLoading(true);
        try {
            const response = await client.mutate({
                mutation: gql`
          mutation LoginUser($email: String!, $password: String!) {
            loginUser(email: $email, password: $password) {
              _id
              username
              email
              createdAt
              token
            }
          }
        `,
                variables: {email, password}
            });
            const user = response.data.loginUser;
            localStorage.setItem('token', user.token);
            this.setUser(user);
            this.setLoading(false);
        } catch (error) {
            this.setError(error.message);
            this.setLoading(false);
            if (error.message === "Not authorized, token failed") {
                authStore.setUnauthorized();
            }
        }
    }

    async getUserProfile() {
        this.setLoading(true);
        try {
            const response = await client.query({
                query: gql`
          query getUserProfile {
            getUserProfile {
              _id
              username
              email
              createdAt
            }
          }
        `,
                context: {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                },
            });
            this.setUser(response.data.getUserProfile);
            this.setLoading(false);
        } catch (error) {
            this.setError(error.message);
            this.setLoading(false);
            if (error.message === "Not authorized, token failed") {
                authStore.setUnauthorized();
            }
        }
    }


    async fetchAllUsers() {
        this.setLoading(true);
        try {
            const response = await client.query({
                query: GET_ALL_USERS,
                context: {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                },
            });
            this.setUsers(response.data.getAllUsers);
            this.setLoading(false);
        } catch (error) {
            this.setError(error.message);
            this.setLoading(false);
            if (error.message === "Not authorized, token failed") {
                authStore.setUnauthorized(); // Update unauthorized state
            }
        }
    }


    logout() {
        localStorage.removeItem('token');
        this.setUser(null);
    }
}

const userStore = new UserStore();
export default userStore;
