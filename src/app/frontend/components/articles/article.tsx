'use client'; // 确保这是一个 Client Component
import { useEffect, useState } from "react";
import Card from "./ariticleCard";

const Article = () => {
  const [articles, setArticles] = useState([
    {
      id: 1,
      title: "Understanding Quantum Computing",
      description: "A deep dive into the world of quantum computing, its potential, and challenges.",
      category: "Science",
      author: "John Doe",
      date: "2024-01-01",
      imageUrl: null,
      link: "#"
    },
    {
      id: 2,
      title: "The Future of Artificial Intelligence",
      description: "Exploring how AI will shape industries in the coming decades.",
      category: "Technology",
      author: "Jane Smith",
      date: "2024-01-02",
      imageUrl: null,
      link: "#"
    },
    {
      id: 3,
      title: "Climate Change and its Impact on Global Ecosystems",
      description: "An in-depth look at the effects of climate change on biodiversity and ecosystems.",
      category: "Environment",
      author: "Alex Johnson",
      date: "2024-02-01",
      imageUrl: null,
      link: "#"
    },
  ]);

  return (
    <div className="flex justify-center items-center flex-col min-h-screen">
      
      <div className="flex flex-wrap gap-6 justify-center">
        {articles.map((article) => (
          <Card
            key={article.id}
            title={article.title}
            imageUrl={article.imageUrl}
            tag={article.category}
            date={article.date}
            description={article.description}
            link={article.link}
          />
        ))}
      </div>
    </div>
  );
};

export default Article;
