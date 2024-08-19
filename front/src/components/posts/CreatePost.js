import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import postStore from '../../stores/PostsStore';

const CreatePost = observer(() => {
    const [content, setContent] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        await postStore.createPost(content);
        setContent('');
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow-md mb-4">
      <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full p-2 border border-gray-300 rounded"
      />
            <button
                type="submit"
                className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
            >
                Post
            </button>
            {postStore.loading && <p>Loading...</p>}
            {postStore.error && <p className="text-red-500 mt-2">{postStore.error}</p>}
        </form>
    );
});

export default CreatePost;
