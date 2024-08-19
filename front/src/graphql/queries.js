import { gql } from '@apollo/client';

export const GET_USER_PROFILE = gql`
  query GetUserProfile {
    getUserProfile {
      _id
      username
      email
      createdAt
    }
  }
`;

export const GET_POSTS = gql`
  query GetPosts {
    getPosts {
      _id
      content
      user {
        _id
        username
      }
      likes {
        _id
        username
      }
      createdAt
    }
  }
`;

export const GET_ROOMS = gql`
  query GetRooms {
    getRooms {
      _id
      name
      users {
        _id
        username
      }
      creator {
        _id
        username
      }
      posts {
        _id
        content
        user {
          _id
          username
        }
        likes {
          _id
          username
        }
        createdAt
      }
      createdAt
    }
  }
`;


export const GET_USER_ROOMS = gql`
  query GetUserRooms {
    getUserRooms {
      _id
      name
      users {
        _id
        username
      }
      creator {
        _id
        username
      }
      posts {
        _id
        content
        user {
          _id
          username
        }
        likes {
          _id
          username
        }
        createdAt
      }
      createdAt
    }
  }
`;

export const GET_ROOM = gql`
  query GetRoom($roomId: ID!) {
    getRoom(roomId: $roomId) {
      _id
      name
      users {
        _id
        username
      }
      creator {
        _id
        username
      }
      posts {
        _id
        content
        user {
          _id
          username
        }
        likes {
          _id
          username
        }
        createdAt
      }
      createdAt
    }
  }
`;

export const GET_ALL_USERS = gql`
  query GetAllUsers {
    getAllUsers {
      _id
      username
      email
      createdAt
    }
  }
`;
