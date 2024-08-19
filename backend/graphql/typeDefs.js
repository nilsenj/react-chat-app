const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID!
    username: String
    email: String!
    createdAt: String!
  }

  type Post {
    _id: ID!
    content: String!
    user: User!
    likes: [User!]
    createdAt: String!
  }

  type Room {
    _id: ID!
    name: String!
    creator: User!
    users: [User!]!
    posts: [Post]
    createdAt: String!
  }

  type Query {
    getUserProfile: User
    getAllUsers: [User]
    getPosts: [Post]
    getRooms: [Room]
    getRoom(roomId: ID!): Room
    getUserRooms: [Room!]!
  }

  type Mutation {
    registerUser(username: String!, email: String!, password: String!): User
    loginUser(email: String!, password: String!): User
    createPost(content: String!, roomId: ID!): Post
    likePost(postId: ID!): Post
    createRoom(name: String!, users: [ID!]!): Room
    inviteUserToRoom(roomId: ID!, userId: ID!): Room
  }
`;

module.exports = typeDefs;
