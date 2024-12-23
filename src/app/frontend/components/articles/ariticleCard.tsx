'use client'; // 确保这是一个 Client Component
import React from 'react';

interface CardProps {
  title: string;
  imageUrl: string;
  tag: string;
  date: string;
  description: string;
  link: string;
}

const Card: React.FC<CardProps> = ({ title, imageUrl, tag, date, description, link }) => {
  return (
    <div className="flex justify-center p-4">
      <div className="max-w-xs bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="relative">
          <div className="w-full h-36 bg-gray-200 p-3">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover rounded-md"
            />
            <span className="absolute top-2 left-3 text-xs uppercase text-white bg-black bg-opacity-50 px-2 py-1 rounded-md">
              {tag}
            </span>
          </div>
          <div className="absolute bottom-3 right-3 text-xs text-gray-500">
            <span>{date}</span>
          </div>
        </div>
        <div className="p-4">
          <a href={link} className="block">
            <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          </a>
          <p className="text-sm text-gray-600 mt-2">{description}</p>
        </div>
        <div className="p-4 border-t text-center">
          <a href={link} className="text-indigo-600 hover:text-indigo-800">Read more...</a>
        </div>
      </div>
    </div>
  );
};

export default Card;