import { gql } from '@apollo/client';

export const CREATE_POST = gql`
  mutation CreatePost($content: String!, $roomId: ID!) {
    createPost(content: $content, roomId: $roomId) {
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

export const LIKE_POST = gql`
  mutation LikePost($postId: ID!) {
    likePost(postId: $postId) {
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

export const CREATE_ROOM = gql`
  mutation CreateRoom($name: String!, $users: [ID!]!) {
    createRoom(name: $name, users: $users) {
      _id
      name
      users {
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

export const INVITE_USER_TO_ROOM = gql`
  mutation InviteUserToRoom($roomId: ID!, $userId: ID!) {
    inviteUserToRoom(roomId: $roomId, userId: $userId) {
      _id
      name
      users {
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
