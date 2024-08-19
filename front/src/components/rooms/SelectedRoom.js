import { useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import roomStore from '../../stores/RoomStore';
import postStore from '../../stores/PostsStore';
import { IoSend } from "react-icons/io5";

const SelectedRoom = observer(() => {
    const [postContent, setPostContent] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);
    const textareaRef = useRef(null);

    if (!roomStore.selectedRoom) {
        return <div className="w-3/4 p-4">Select a room to see posts</div>;
    }

    const handleExpand = () => {
        setIsExpanded(true);
        setTimeout(() => {
            textareaRef.current.focus();
        }, 0);
    };

    const handlePostSubmit = async (e) => {
        e.preventDefault();
        await postStore.createPost(postContent, roomStore.selectedRoom._id);
        setPostContent('');
    };

    const handleLike = async (postId) => {
        await postStore.likePost(postId);
    };

    return (
        <div className="w-3/4 p-4 flex flex-col h-full relative">
            <h2 className="text-2xl font-bold mb-4">{roomStore.selectedRoom.name}</h2>
            <div className="space-y-4 overflow-y-auto flex-grow mb-24">
                {roomStore?.selectedRoom?.posts.map(post => (
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
            <form onSubmit={handlePostSubmit}
                  className="fixed bottom-0 right-0 w-3/4 p-4 bg-white border-t border-gray-300 flex items-center">
                <div className="relative w-full">
                    {!isExpanded ? (
                        <input
                            type="text"
                            placeholder="Write a post..."
                            className="w-full p-2 border border-gray-300 rounded"
                            onFocus={handleExpand}
                        />
                    ) : (
                        <textarea
                            ref={textareaRef}
                            value={postContent}
                            onChange={(e) => setPostContent(e.target.value)}
                            placeholder="Write a post..."
                            className="w-full p-2 border border-gray-300 rounded pr-12"
                        />
                    )}
                    <button
                        type="submit"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary text-white p-2 rounded-full"
                    >
                        <IoSend size={20}/>
                    </button>
                </div>
            </form>
        </div>
    );
});

export default SelectedRoom;
