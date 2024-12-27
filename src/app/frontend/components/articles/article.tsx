'use client'; // 确保这是一个 Client Component
import request from "@/utils/request";
import { useEffect, useState } from "react";
import { Pagination, DatePicker, Button } from 'antd'; // 引入 Pagination 和 DatePicker 组件
import Card from "./ariticleCard";
import { Article as ArticleType } from "@/app/frontend/components/info";
import moment from 'moment'; // 用于处理日期
import config from "@/config/baseurl_config";

interface ArticleProps {
  categoryId: number;  // 只接收 categoryId 参数
}

const Article: React.FC<ArticleProps> = ({ categoryId }) => {
  const [articles, setArticles] = useState<ArticleType[]>([]); // 文章数据
  const [total, setTotal] = useState<number>(0);  // 总文章数量
  const [currentPage, setCurrentPage] = useState<number>(1);  // 当前页数
  const [startDate, setStartDate] = useState<moment.Moment | null>(null); // 起始日期
  const [endDate, setEndDate] = useState<moment.Moment | null>(null); // 结束日期
  const rows = 4; // 每页显示的条数，默认是4

  // 请求文章数据的函数
  const fetchArticles = async (page: number, type: number, startDate?: string, endDate?: string) => {
    try {
      const params: any = {
        page, // 当前页
        rows, // 每页显示的条数
        type, // 分类ID
      };
      if (startDate) {
        params.startTime = startDate; // 如果有起始日期，添加到请求参数中
      }
      if (endDate) {
        params.endTime = endDate; // 如果有结束日期，添加到请求参数中
      }

      const response = await request.get(`/articleView/bycatagory`, {
        params
      });
      if (response.data.success) {
        setArticles(response.data.data.list);
        setTotal(response.data.data.total);  // 假设API返回了total字段，总文章数量
      }
    } catch (error) {
      alert("获取文章数据失败");
    }
  };

  // 切换页面时请求新的文章数据
  const onPageChange = (page: number) => {
    setCurrentPage(page);
    fetchArticles(page, categoryId, startDate ? startDate.format('YYYY-MM-DD') : undefined, endDate ? endDate.format('YYYY-MM-DD') : undefined);
  };

  // 处理起始日期的变化
  const handleStartDateChange = (date: moment.Moment | null) => {
    setStartDate(date);
  };

  // 处理结束日期的变化
  const handleEndDateChange = (date: moment.Moment | null) => {
    setEndDate(date);
  };

  // 初始加载时获取文章数据
  useEffect(() => {
    fetchArticles(currentPage, categoryId, startDate ? startDate.format('YYYY-MM-DD') : undefined, endDate ? endDate.format('YYYY-MM-DD') : undefined);
  }, [currentPage, categoryId, startDate, endDate]);  // 依赖项中加入 categoryId、startDate 和 endDate

  return (
    <div className="flex flex-col items-center py-8 bg-gray-50 min-h-screen">
      <div className="flex flex-wrap items-center gap-4 mb-10 w-4/5 mx-auto justify-start">
        {/* 起始日期选择器 */}
        <DatePicker
          value={startDate}
          onChange={handleStartDateChange}
          placeholder="选择起始日期"
          format="YYYY-MM-DD"
        />
        {/* 结束日期选择器 */}
        <DatePicker
          value={endDate}
          onChange={handleEndDateChange}
          placeholder="选择结束日期"
          format="YYYY-MM-DD"
        />
      </div>

      <div className="flex flex-row flex-wrap gap-6 w-4/5 mx-auto">
        {articles.map((article) => (
          <Card
            key={article.idArticle}
            title={article.articleTitle}
            imageUrl={config.baseUrl+ article.articleThumbnailUrl||"/images/bg/bg3.jpg"}
            tag={article.articleTags}
            date={moment(article.updatedTime).format("YYYY-MM-DD")}
            description={article.articlePreviewContent}
            link={article.articleLink}
          />
        ))}
      </div>

      {/* 分页组件 */}
      <div className="mt-8 w-4/5 mx-auto flex justify-center">
        <Pagination
          current={currentPage} // 当前页数
          total={total} // 总文章数
          pageSize={rows} // 每页显示的条数
          onChange={onPageChange} // 页码改变时触发的回调
          showSizeChanger={false} // 不显示页面大小切换器
          showTotal={(total:number) => `总共 ${total} 篇`} // 总项数
        />
      </div>
    </div>
  );
};

export default Article;
