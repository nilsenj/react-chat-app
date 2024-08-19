import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import postStore from '../../stores/PostsStore';

const PostList = observer(() => {
    useEffect(() => {
        postStore.fetchPosts();
    }, []);

    const handleLike = async (postId) => {
        await postStore.likePost(postId);
    };

    if (postStore.loading) return <p>Loading...</p>;
    if (postStore.error) return <p>Error: {postStore.error}</p>;

    return (
        <div className="space-y-4">
            {postStore.posts.map(post => (
                <div key={post._id} className="p-4 bg-white rounded shadow-md">
                    <p>{post.content}</p>
                    <p className="text-sm text-gray-500">By: {post.user.username}</p>
                    <button
                        onClick={() => handleLike(post._id)}
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        {post.likes.length} Likes
                    </button>
                </div>
            ))}
        </div>
    );
});

export default PostList;
