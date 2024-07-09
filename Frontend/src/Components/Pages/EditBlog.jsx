import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import Editor from './Editor';
import { BASE_URL } from '../../../config';
import { toast } from 'react-toastify';

export default function EditPost() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState('');
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    fetch(`${BASE_URL}/blog/blog/${id}`)
      .then(response => response.json())
      .then(postInfo => {
        setTitle(postInfo.findBlog.title);
        setContent(postInfo.findBlog.content);
        setSummary(postInfo.findBlog.summary);
      })
      .catch(error => {
        console.error('Error fetching post:', error);
        toast.error('Error fetching post data');
      });
  }, [id]);

  async function updatePost(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('id', id);
    if (files?.[0]) {
      data.set('file', files?.[0]);
    }

    try {
      const response = await fetch(`${BASE_URL}/blog/blog/${id}`, {
        method: 'PUT',
        body: data,
        credentials: 'include',
      });

      if (response.ok) {
        setRedirect(true);
        toast.success('Post updated successfully');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Update failed');
      }
    } catch (error) {
      console.error('Update failed:', error);
      toast.error('Failed to update post');
    }
  }

  if (redirect) {
    return <Navigate to={'/home'} />;
  }

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Edit Blog Post</h1>
      <form onSubmit={updatePost} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={ev => setTitle(ev.target.value)}
          className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Summary"
          value={summary}
          onChange={ev => setSummary(ev.target.value)}
          className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="file"
          onChange={ev => setFiles(ev.target.files)}
          className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Editor
          value={content}
          onChange={setContent}
          className="border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-96"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300"
          style={{ marginTop: '5px' }}
        >
          Update Post
        </button>
      </form>
    </div>
  );
}
