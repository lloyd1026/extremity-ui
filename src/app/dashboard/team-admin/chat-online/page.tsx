'use client';

import React, { useEffect, useState } from "react";
import request from "@/utils/request";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

// 定义 Article 数据类型
interface Article {
    idArticle: number;
    articleTitle: string;
    [key: string]: any;
}

const PAGE_SIZE = 8; // 每页显示的文章数量

const ArticleList: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const router = useRouter();
    const currentPath = usePathname();

    // 获取所有文章
    const fetchAllArticles = async () => {
        try {
            const response = await request.get(`/article`);
            if (response.data.success) {
                setArticles(response.data.data);
                setTotalPages(Math.ceil(response.data.data.length / PAGE_SIZE)); // 计算总页数
            } else {
                console.error("Failed to fetch articles:", response.data);
            }
        } catch (error) {
            console.error("Error fetching articles:", error);
        }
    };

    // 跳转到评论页面
    const handleArticleClick = (articleId: number) => {
        router.push(`${currentPath}/${articleId}?articleId=${articleId}`);
    };

    // 切换分页
    const handlePageChange = (page: number) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    useEffect(() => {
        fetchAllArticles();
    }, []);

    // 当前页的文章列表
    const currentArticles = articles.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    return (
        <div>
            <h1 className="text-xl font-bold mb-4">文章评论区</h1>
            <ul className="space-y-4">
                {currentArticles.map((article) => (
                    <li
                        key={article.idArticle}
                        onClick={() => handleArticleClick(article.idArticle)}
                        className="cursor-pointer p-4 border rounded-lg hover:bg-gray-100" // 添加 rounded-lg 实现圆角样式
                    >
                        <h2 className="text-lg font-semibold">{article.articleTitle}</h2>
                    </li>
                ))}
            </ul>

            {/* 分页控件 */}
            <div className="mt-4 flex justify-center space-x-2">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 border rounded ${
                        currentPage === 1 ? "bg-gray-200 cursor-not-allowed" : "hover:bg-gray-100"
                    }`}
                >
                    上一页
                </button>
                <span className="px-4 py-2">{`第 ${currentPage} 页，共 ${totalPages} 页`}</span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 border rounded ${
                        currentPage === totalPages ? "bg-gray-200 cursor-not-allowed" : "hover:bg-gray-100"
                    }`}
                >
                    下一页
                </button>
            </div>
        </div>
    );
};

export default ArticleList;