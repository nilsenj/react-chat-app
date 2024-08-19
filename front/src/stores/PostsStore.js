import {makeAutoObservable} from 'mobx';
import client from '../apolloClient';
import {GET_POSTS} from '../graphql/queries';
import {LIKE_POST, CREATE_POST} from '../graphql/mutations';
import roomStore from "./RoomStore";
import authStore from "./AuthStore";

class PostStore {
    posts = [];
    loading = false;
    error = null;

    constructor() {
        makeAutoObservable(this);
        this.fetchPosts();
    }

    setPosts(posts) {
        this.posts = posts;
    }

    setLoading(loading) {
        this.loading = loading;
    }

    setError(error) {
        this.error = error;
    }

    async fetchPosts() {
        this.setLoading(true);
        try {
            const response = await client.query({
                query: GET_POSTS,
                context: {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                },
            });
            this.setPosts(response.data.getPosts);
            this.setLoading(false);
        } catch (error) {
            this.setError(error.message);
            this.setLoading(false);
            if (error.message === "Not authorized, token failed") {
                authStore.setUnauthorized(); // Update unauthorized state
            }
        }
    }

    async createPost(content, roomId) {
        this.setLoading(true);
        try {
            const response = await client.mutate({
                mutation: CREATE_POST,
                variables: {content, roomId},
                context: {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                },
            });
            const newPost = response.data.createPost;

            this.posts.push(newPost);
            roomStore.addPostToSelectedRoom(newPost); // Update the selectedRoom with the new post

            this.setLoading(false);
        } catch (error) {
            this.setError(error.message);
            this.setLoading(false);
            if (error.message === "Not authorized, token failed") {
                authStore.setUnauthorized(); // Update unauthorized state
            }
        }
    }

    async likePost(postId) {
        this.setLoading(true);
        try {
            const response = await client.mutate({
                mutation: LIKE_POST,
                variables: {postId},
                context: {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                },
            });
            const updatedPost = response.data.likePost;
            roomStore.updatePostInSelectedRoom(updatedPost); // Update the specific post in selectedRoom
            this.posts = this.posts.map(post => post._id === updatedPost._id ? updatedPost : post);
            this.setLoading(false);
        } catch (error) {
            this.setError(error.message);
            this.setLoading(false);
            if (error.message === "Not authorized, token failed") {
                authStore.setUnauthorized();
            }
        }
    }
}

const postStore = new PostStore();
export default postStore;
