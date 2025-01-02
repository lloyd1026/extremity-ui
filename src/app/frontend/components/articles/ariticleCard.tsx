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
    <div className="flex justify-center p-4 w-full">
      {/* 使用 <a> 标签包裹整个卡片，点击整个卡片会跳转 */}
      <a
        href={link}
        className="w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden flex transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
      >
        {/* 图片部分，图片在左边 */}
        <div className="relative w-1/3 h-full ">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-[200px] object-cover rounded-l-lg"
          />
          <span className="absolute top-2 left-3 text-xs uppercase text-white bg-black bg-opacity-50 px-2 py-1 rounded-md">
            {tag}
          </span>
          <div className="absolute bottom-3 right-3 text-xs text-gray-500">
            <span>{date}</span>
          </div>
        </div>

        {/* 文字部分，文字在右边 */}
        <div className="flex flex-col justify-between p-4 w-2/3 min-h-[200px]">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-600 mt-2 flex-grow">{description}</p>
        </div>
      </a>
    </div>
  );
};

export default Card;
