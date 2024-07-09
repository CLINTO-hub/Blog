import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BASE_URL } from '../../../config.js';
import { formatISO9075 } from 'date-fns';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const PostPage = () => {
  const [postInfo, setPostInfo] = useState(null);
  const { id } = useParams();
  const userId = useSelector(state => state.auth.userId);
  console.log('userrr',userId);
  const navigate = useNavigate()

  useEffect(() => {
    fetch(`${BASE_URL}/blog/blog/${id}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        "Content-Type": 'application/json',
      },
    })
      .then(response => response.json())
      .then(postInfo => {
        setPostInfo(postInfo.findBlog);
        console.log('post', postInfo.findBlog);
      })
      .catch(error => console.error('Error fetching post:', error));
  }, [id]);

  const handleDeletePost = async () => {
    try {
      const response = await fetch(`${BASE_URL}/blog/blog/deleteblog/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (response.ok) {
          navigate('/home')       
        console.log('Post deleted successfully:', data);
         
      } else {
        console.error('Failed to delete post:', data.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  if (!postInfo) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-14 bg-white rounded-xl shadow-xl">
      <h1 className="text-5xl font-bold text-center mb-6 text-gray-800">{postInfo.title}</h1>
      <time className="block text-center text-gray-500 mb-2">
        {formatISO9075(new Date(postInfo.createdAt))}
      </time>
      <div className="text-center text-gray-600 mb-6">
        by <span className="font-semibold">@{postInfo.author.firstname} {postInfo.author.lastname}</span>
      </div>
      {userId === postInfo.author._id &&(
        <div className='justify-center'>
          <Link to={`/editBlog/${postInfo._id}`}>
           <a
               className="edit bg-blue-600 text-white py-1 px-3 text-sm rounded-md hover:bg-blue-700 inline-flex items-center justify-center self-end"
                style={{ width: '150px', marginLeft: '200px' }}href="#">Edit this post</a>
</Link>
<button
            className="bg-red-600 text-white py-1 px-3 text-sm rounded-md padding hover:bg-red-700 ml-1"
            onClick={handleDeletePost}
          >
            Delete this post
          </button>
          </div>
      )}
      <img
        className="w-full h-auto max-w-md mx-auto mb-6 rounded-md shadow-md mt-5 "
        src={postInfo.uploadedimg}
        alt=""
      />
      <div className="prose lg:prose-xl mx-auto" dangerouslySetInnerHTML={{ __html: postInfo.content }}></div>
    </div>
  );
};

export default PostPage;
