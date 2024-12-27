"use client"
import { useState, useEffect } from 'react';
import { Button, Select, Pagination, Card, Tag } from 'antd';
import { useRouter } from 'next/navigation';
import instance from '@/utils/request';
import Image from 'next/image';
import { toast } from 'react-toastify';
import config from "@/config/baseurl_config";

interface Article {
  idArticle: number;
  articleTitle: string;
  articleThumbnailUrl: string;
  articleType: string;
  articleTags: string;
  articleStatus: string;
}

interface PageInfo<T> {
  list: T[];
  pageNum: number;
  pageSize: number;
  total: number;
}

const articleTypeOptions = [
  { label: '科研文章', value: '0' },
  { label: '专著', value: '1' },
  { label: '专利', value: '2' },
  { label: '产品', value: '3' },
  { label: '软著', value: '4' },
];

const ArticlesPage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedType, setSelectedType] = useState<string>(''); // To filter articles by type
  const [currentPage, setCurrentPage] = useState<number>(1); // Track current page
  const [totalPages, setTotalPages] = useState<number>(0); // Track total pages
  const router = useRouter();

  useEffect(() => {
    fetchArticles();
  }, [selectedType, currentPage]);

  const fetchArticles = async () => {
    const res = await instance.get(`/article/bycatagory`, {
      params: {
        type: selectedType,
        page: currentPage - 1, // Backend uses 0-based indexing for pages
        rows: 12,
      },
    });
    const data: PageInfo<Article> = res.data.data; // Assuming response is under `data.data`
    setArticles(data.list);
    setTotalPages(Math.ceil(data.total / 12)); // Total pages based on the total number of articles
  };

  const handleDelete = async (id: number) => {
    const res = await instance.delete(`/article/${id}`);
    if (res.data.success) {
      toast.success("删除成功");
      setArticles(articles.filter((article) => article.idArticle !== id));
    }
  };
  const handleUndo= async (id: number) => {
    const res = await instance.get(`/article/unshow/${id}`);
    if (res.data.success) {
      toast.success("撤回成功");
      setArticles(articles.filter((article) => article.idArticle !== id));
    }
  };
  const handleHide = async (id: number) => {
    const res = await instance.get(`/article/hide/${id}`);
    if (res.data.success) {
        const updatedArticles = articles.map(article => 
            article.idArticle === id ? { ...article, articleStatus: "5" } : article
          );
          
          setArticles(updatedArticles);
      toast.success("隐藏成功");
    }
  };
  const handleUnhide = async (id: number) => {
    const res = await instance.get(`/article/unhide/${id}`);
    if (res.data.success) {
        const updatedArticles = articles.map(article => 
            article.idArticle === id ? { ...article, articleStatus: "1" } : article
          );
          
          setArticles(updatedArticles);
      toast.success("取消隐藏成功");
    }
  };

  const handlePreview = (id: number) => {
    router.push(`/dashboard/preview/${id}`);
  };

  const handleEdit = (id: number) => {
    router.push(`/dashboard/team-admin/editarticle/${id}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">文章列表</h1>
      
      {/* Article Type Filter */}
      <div className="mb-6">
        <label className="mr-4">筛选文章类型:</label>
        <Select
          value={selectedType}
          onChange={(value) => setSelectedType(value)}
          className="w-48"
          placeholder="选择文章类型"
        >
          <Select.Option value="">全部</Select.Option>
          {articleTypeOptions.map((option) => (
            <Select.Option key={option.value} value={option.value}>
              {option.label}
            </Select.Option>
          ))}
        </Select>
      </div>

      {/* Article List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Card
            key={article.idArticle}
            className="rounded-lg shadow-lg"
            hoverable
            cover={
              <Image
                alt={article.articleTitle}
                src={
                  article.articleThumbnailUrl 
                    ? config.baseUrl + article.articleThumbnailUrl 
                    : "/images/bg/bg3.jpg"
                }
                layout="responsive"
                width={500}
                height={300}
              />
            }
          >
            <Card.Meta
              title={<h2 className="text-xl font-bold">{article.articleTitle}</h2>}
              description={<p className="text-gray-500">标签: {article.articleTags?article.articleTags.split(',').map((tag, index) => <Tag key={index}>{tag}</Tag>):[]}</p>}
            />
            <div className="mt-4 flex justify-between">
              <Button type="link" onClick={() => handlePreview(article.idArticle)}>预览</Button>
              <Button type="link" onClick={() => handleEdit(article.idArticle)}>编辑</Button>
              {
                (article.articleStatus=="1")?
                (<Button type="link" onClick={() => handleHide(article.idArticle)}>隐藏</Button>):
                <Button type="link" onClick={() => handleUnhide(article.idArticle)}>显示</Button>
              }
              <Button type="link" danger onClick={() => handleUndo(article.idArticle)}>撤回发布</Button>
              <Button type="link" danger onClick={() => handleDelete(article.idArticle)}>删除</Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6">
        <Pagination
          current={currentPage}
          total={totalPages * 12} // Total count is the number of articles
          pageSize={12}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
};

export default ArticlesPage;