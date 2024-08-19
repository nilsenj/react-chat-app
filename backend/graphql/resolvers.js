const User = require('../models/User');
const Post = require('../models/Post');
const Room = require('../models/Room');
const jwt = require('jsonwebtoken');

const resolvers = {
    Query: {
        getUserProfile: async (_, __, { req }) => {
            if (!req.user) {
                throw new Error('Not authenticated');
            }
            return req.user;
        },
        getAllUsers: async () => {
            return await User.find();
        },
        getPosts: async () => {
            return await Post.find().populate('user likes');
        },
        getRooms: async () => {
            return await Room.find().populate('users posts');
        },
        getRoom: async (_, { roomId }) => {
            return await Room.findById(roomId).populate('users posts');
        },
        getUserRooms: async (_, __, { req }) => {
            if (!req.user) {
                throw new Error('Not authenticated');
            }
            return Room.find({
                $or: [
                    {creator: req.user._id},
                    {users: req.user._id}
                ]
            }).populate('users creator posts');
        },
    },
    Mutation: {
        registerUser: async (_, { username, email, password }) => {
            const userExists = await User.findOne({ email });

            if (userExists) {
                throw new Error('User already exists');
            }

            const user = new User({
                username,
                email,
                password,
            });

            await user.save();

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: '30d',
            });

            return {
                _id: user._id,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt,
            };
        },
        loginUser: async (_, { email, password }) => {
            const user = await User.findOne({ email });

            if (user && (await user.matchPassword(password))) {
                const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                    expiresIn: '30d',
                });

                return {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    createdAt: user.createdAt,
                };
            } else {
                throw new Error('Invalid email or password');
            }
        },
        createPost: async (_, { content, roomId }, { req }) => {
            if (!req.user) {
                throw new Error('Not authenticated');
            }

            const post = new Post({
                content,
                user: req.user._id
            });

            await post.save();

            const room = await Room.findById(roomId);
            room.posts.push(post);
            await room.save();

            return post.populate('user');
        },
        likePost: async (_, { postId }, { req }) => {
            if (!req.user) {
                throw new Error('Not authenticated');
            }

            const post = await Post.findById(postId);

            if (!post) {
                throw new Error('Post not found');
            }

            if (post.likes.includes(req.user._id)) {
                post.likes = post.likes.filter(like => like.toString() !== req.user._id.toString());
            } else {
                post.likes.push(req.user._id);
            }

            await post.save();

            return post.populate('user likes');
        },
        createRoom: async (_, { name, users }, { req }) => {
            if (!req.user) {
                throw new Error('Not authenticated');
            }
            const room =
                new Room({
                    name,
                    users: [...users, req.user._id], creator: req.user._id, createdAt: new Date().toISOString() });

            await room.save();

            return room.populate('users creator');
        },
        inviteUserToRoom: async (_, { roomId, userId }) => {
            const room = await Room.findById(roomId);
            const user = await User.findById(userId);

            if (!room || !user) {
                throw new Error('Room or User not found');
            }

            room.users.push(user);
            await room.save();

            return room.populate('users posts');
        }
    }
};

module.exports = resolvers;
