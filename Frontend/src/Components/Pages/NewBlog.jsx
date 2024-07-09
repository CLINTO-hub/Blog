import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Editor from '../Pages/Editor.jsx';
import { BASE_URL } from "../../../config.js";
import { toast } from "react-toastify";
import { useSelector } from 'react-redux';
import HashLoader from 'react-spinners/HashLoader';
import 'react-quill/dist/quill.snow.css';

function NewBlog() {
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    image: null,  // New state to hold the selected image file
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const userId = useSelector(state => state.auth.userId);
  console.log('user', userId);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditorChange = (value) => {
    setFormData({ ...formData, content: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('summary', formData.summary);
      data.append('content', formData.content);
      if (formData.image) {
        data.append('image', formData.image);  // Append image file to FormData
      }

      const response = await fetch(`${BASE_URL}/blog/createblog/${userId}`, {
        method: 'POST',
        body: data,
        credentials: 'include',
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }

      toast.success(result.message);
      setLoading(false);
      navigate('/home');
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <HashLoader size={50} color={"#123abc"} loading={loading} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Create New Blog Post</h1>
      <form onSubmit={submitHandler} className="flex flex-col gap-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleInputChange}
          className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="summary"
          placeholder="Summary"
          value={formData.summary}
          onChange={handleInputChange}
          className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="file"
          onChange={handleFileChange}  
          className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Editor
          value={formData.content}
          onChange={handleEditorChange}
          className="border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-96"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300 relative"
          style={{ marginTop: '5px' }}
          disabled={loading}
        >
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <HashLoader size={30} color={"#ffffff"} loading={loading} />
            </div>
          ) : (
            <span>Create Post</span>
          )}
        </button>
      </form>
    </div>
  );
}

export default NewBlog;
