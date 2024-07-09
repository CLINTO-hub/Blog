import React from 'react';
import { formatISO9075 } from 'date-fns';
import { Link } from 'react-router-dom';

function Post({ _id, title, summary, uploadedimg, content, createdAt, author }) {
  return (
    <div className="flex items-center justify-center post grid grid-cols-1 gap-5 mb-7 md:grid-cols-[0.9fr,1.1fr]">
      <div className="flex items-center justify-center image max-h-[300px] overflow-hidden">
        <Link to={`/create/${_id}`}>
        <img src={uploadedimg} alt={title} className="object-cover object-center w-full" />
        </Link>
      </div>
      <div className="texts">
        <Link to={`/create/${_id}`}>
        <h2 className="text-4xl m-0">{title}</h2>
        </Link>
        <p className="info flex gap-2 text-gray-500 my-6 font-bold text-base">
          <a className="author text-gray-800">{author.firstname + " " + author.lastname}</a>
          <time>{formatISO9075(new Date(createdAt))}</time>
        </p>
        <h3 className="summary my-2 leading-[1.8rem]">{summary}</h3>
        <div className="prose lg:prose-xl mx-auto" dangerouslySetInnerHTML={{ __html:content }}></div>
      </div>
    </div>
  );
}

export default Post;
