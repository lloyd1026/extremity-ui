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
    {
      id: 4,
      title: "The Evolution of Human Society: A Historical Perspective",
      description: "A comprehensive overview of human society's evolution from prehistory to modern times.",
      category: "History",
      author: "Maria Lee",
      date: "2024-03-01",
      imageUrl: null,
      link: "#"
    },
    {
      id: 5,
      title: "Exploring the Mysteries of Deep Space",
      description: "An exploration of the unknowns in deep space and what scientists are discovering.",
      category: "Astronomy",
      author: "Samuel Adams",
      date: "2024-04-10",
      imageUrl: null,
      link: "#"
    },
    {
      id: 6,
      title: "The Role of Genetics in Modern Medicine",
      description: "How genetic research is reshaping the future of healthcare and personalized medicine.",
      category: "Health",
      author: "Dr. Emily Wong",
      date: "2024-05-05",
      imageUrl: null,
      link: "#"
    },
    {
      id: 7,
      title: "The Psychology of Human Behavior",
      description: "A look into how psychology helps us understand human behavior in different situations.",
      category: "Psychology",
      author: "Robert Clark",
      date: "2024-06-20",
      imageUrl: null,
      link: "#"
    },
    {
      id: 8,
      title: "Innovations in Renewable Energy",
      description: "Exploring cutting-edge technologies in solar, wind, and other renewable energy sources.",
      category: "Technology",
      author: "Lisa Green",
      date: "2024-07-15",
      imageUrl: null,
      link: "#"
    },
  ]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-4">科研文章</h1>
      <div className="flex flex-wrap gap-6">
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