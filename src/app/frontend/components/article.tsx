'use client'; // 确保这是一个 Client Component
import { useEffect, useState } from "react";
import request from "@/utils/request";
import {articleDetails} from "./info"
const Article = () => {
  const [articles, setArticles] = useState<articleDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await request.get("/article")
        setArticles(response.data.data);  // 假设响应数据存储在 `data` 属性中
        console.log(response.data)
      } catch (err) {
      } finally {
        setLoading(false);  // 无论成功或失败，都更新加载状态
      }
    };

    fetchArticle();
  }, []);  // 空数组，确保只在组件首次渲染时执行

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
         <ul>
        {articles.map((article, index) => (
          <li key={index}>
            <p>{article.articleTitle}</p> {/* 假设每篇文章有一个 content 属性 */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Article;
