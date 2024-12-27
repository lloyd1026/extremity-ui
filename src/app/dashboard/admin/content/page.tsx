"use client"
import { useState, useEffect } from 'react';
import { Button, Select, Pagination, Card, Tag, Modal, Input } from 'antd';
import { useRouter } from 'next/navigation';
import instance from '@/utils/request';
import Image from 'next/image';
import { toast } from 'react-toastify';
import config from '@/config/baseurl_config';

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

  const [rejectInfo, setRejectInfo] = useState(""); // To store rejection reason
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false); // To control the visibility of the modal
  const [rejectArticleId, setRejectArticleId] = useState<number | null>(null); // To track which article is being rejected

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
        status: 2,
      },
    });
    const data: PageInfo<Article> = res.data.data; // Assuming response is under `data.data`
    setArticles(data.list);
    setTotalPages(Math.ceil(data.total / 12)); // Total pages based on the total number of articles
  };

  const handleReject = async () => {
    if (rejectArticleId === null) return;
    const res = await instance.post(`/article/reject/${rejectArticleId}`, {
      rejectInfo,
    });
    if (res.data.success) {
      setArticles(articles.filter((article) => article.idArticle !== rejectArticleId));
      toast.success("文章已拒绝发布");
      setIsRejectModalVisible(false); // Close the modal
    }
  };

  const handleAlright = async (id: number) => {
    const res = await instance.get(`/article/deliver/${id}`);
    if (res.data.success) {
      toast.success("发布成功");
      setArticles(articles.filter((article) => article.idArticle !== id));
    }
  };

  const handlePreview = (id: number) => {
    router.push(`/dashboard/preview/${id}`);
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
              description={<p className="text-gray-500">标签: {article.articleTags ? article.articleTags.split(',').map((tag, index) => <Tag key={index}>{tag}</Tag>) : []}</p>}
            />
            <div className="mt-4 flex justify-between">
              <Button type="link" onClick={() => handlePreview(article.idArticle)}>预览</Button>
              <Button type="link" onClick={() => handleAlright(article.idArticle)}>同意发布</Button>
              <Button type="link" danger onClick={() => {
                setRejectArticleId(article.idArticle); // Set the article ID for rejection
                setIsRejectModalVisible(true); // Open modal for rejection reason
              }}>拒绝发布</Button>
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

      {/* Reject Modal */}
      <Modal
        title="拒绝发布理由"
        open={isRejectModalVisible}
        onCancel={() => setIsRejectModalVisible(false)}
        onOk={handleReject}
        okText="提交"
        cancelText="取消"
      >
        <Input.TextArea
          value={rejectInfo}
          onChange={(e) => setRejectInfo(e.target.value)}
          placeholder="请输入拒绝发布的理由"
          rows={4}
        />
      </Modal>
    </div>
  );
};

export default ArticlesPage;