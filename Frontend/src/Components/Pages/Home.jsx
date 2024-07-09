import Post from "./Post.jsx";
import {useEffect, useState} from "react";
import { BASE_URL } from "../../../config.js";

const home = ()=> {
  const [posts,setPosts] = useState([]);
  useEffect(() => {
    fetch(`${BASE_URL}/blog/blog`).then(response => {
      response.json().then(posts => {
        setPosts(posts.result);
        console.log('hello',posts);
      });
    });
  }, []);
  return (
    <>
      {posts.length > 0 && posts.map(post => (
        <Post {...post} />
      ))}
    </>
  );
}

export default home;