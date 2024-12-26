import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import instance from "@/utils/request";
import { toast } from "react-toastify";
import { useAuth } from "../auth/authcontext";
import { useSharedState,useUpdateSharedState} from "./sharedContext";

interface Article {
  idArticle: string|null;
  articleTitle: string;
  articleStatus: string; // "0"表示草稿, "1"表示已发布
}

const Sidebar = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null); // 当前编辑中的文章ID
  const [tempTitle, setTempTitle] = useState<string>("");           // 编辑/新建时的临时输入

  const { auth } = useAuth();

  // 草稿 & 已发布
  const drafts = articles.filter((item) => item.articleStatus === "0");
  const audit = articles.filter((item) => item.articleStatus === "2");
  const published = articles.filter((item) => item.articleStatus === "1");

  const sharedState = useSharedState();
  const setSharedState = useUpdateSharedState();

  // 占位符行输入框的 ref，用于聚焦
  const placeholderInputRef = useRef<HTMLInputElement>(null);

  // 模拟请求后端接口获取文章列表
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await instance.get("/article/1");
        if (response.data.success) {
          setArticles(response.data.data);
        }
      } catch (error) {
        toast.error("读取文章内容失败");
      }
    };
    if (auth) {
      fetchArticles();
    }
  }, [auth,sharedState]);

  /**
   * ---------------------------
   *     处理「新增」文章
   * ---------------------------
   */
  const handleCreateArticle = async () => {
    // 如果输入为空，则不创建
    if (!tempTitle.trim()) {
      setTempTitle(""); // 清空
      return;
    }

    const newArticle: Article = {
      idArticle:null,
      articleTitle: tempTitle.trim(),
      articleStatus: "0", // 默认草稿
    };

    try {
        const response = await instance.post("/article/Draft",newArticle);
        if (response.data.success) {
            newArticle.idArticle = response.data.data;
            setArticles([ ...articles,newArticle]);
            toast.success("创建文章成功");
        }else{
            toast.error("创建文章失败");
        }
      }
        catch (error) {
        toast.error("创建文章失败");
    }
    setTempTitle(""); // 清空输入
    return;
    };

  const handleDeleteArticle = async (id: string) => {
    if (window.confirm("确认要删除这篇文章吗？")) {
        try {
            const response = await instance.delete(`/article/Draft/${id}`);
            if (response.data.success) {
                setArticles(articles.filter((item) => item.idArticle !== id));
                toast.success("已删除");
            }else{
                toast.error("删除文章失败");
            }
          } catch (error) {
            toast.error("删除文章失败");
        }
    } else {
      toast.info("已取消删除");
    }
  };

  const handleEditStart = (id: string) => {
    setEditingId(id);
    const articleToEdit = articles.find((item) => item.idArticle === id);
    if (articleToEdit) {
      setTempTitle(articleToEdit.articleTitle);
    }
  };

  // 保存修改：Enter
  const handleEditSave = async () => {
    if (!editingId) return;
    try{
        const response = await instance.put("/article/Draft",{"idArticle":editingId,"articleTitle":tempTitle.trim()});
        if (response.data.success) {
            setArticles(
            articles.map((item) =>
                item.idArticle === editingId
                ? { ...item, articleTitle: tempTitle.trim() }
                : item
            )
            );
            toast.success("修改文章成功");
        }else{
            toast.error("修改文章失败");
        }
    }
    catch(error){
        toast.error("修改文章失败");
    }
    setEditingId(null);
    setTempTitle("");
  };

  // 取消编辑：Esc
  const handleEditCancel = () => {
    setEditingId(null);
    setTempTitle("");
  };

  /**
   * 处理占位符行的键盘事件
   */
  const handlePlaceholderKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCreateArticle(); 
    } else if (e.key === "Escape") {
      // Esc 直接清空
      setTempTitle("");
      (e.target as HTMLInputElement).blur();
    }
  };

  /**
   * 编辑状态下的键盘事件
   */
  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleEditSave();
    } else if (e.key === "Escape") {
      handleEditCancel();
    }
  };

  /**
   * 渲染单条文章
   */
  const renderArticleItem = (article: Article) => {
    const isEditing = editingId === article.idArticle;
    if (isEditing) {
      // 编辑态：显示 input，支持 Enter/Esc
      return (
        <div className="flex-1">
          <input
            type="text"
            className="w-full px-2 py-1 text-sm border rounded outline-none focus:ring-2 focus:ring-blue-300"
            value={tempTitle}
            autoFocus
            onChange={(e) => setTempTitle(e.target.value)}
            onKeyDown={handleEditKeyDown}
          />
        </div>
      );
    } else {
      // 普通态：显示标题，双击可编辑
      return (
        <Link
          href={`/frontend/editor/${article.idArticle}`}
          className="flex-1 block px-2 py-1 text-sm rounded hover:bg-gray-100"
          onDoubleClick={() => handleEditStart(article.idArticle)}
        >
          {article.articleTitle || "无标题"}
        </Link>
      );
    }
  };

  /**
   * 渲染某一类别文章列表（草稿or已发布）
   */
  const renderList = (list: Article[]) => {
    return list.map((item) => (
      <li
        key={item.idArticle}
        className="group flex items-center space-x-1 border-b border-gray-100 py-1"
      >
        {/* 文章标题 / 编辑区域 */}
        {renderArticleItem(item)}

        {/* 删除按钮：悬停时显示 */}
        {!editingId && (
          <button
            className="invisible group-hover:visible text-gray-400 hover:text-red-400 px-1"
            title="删除文章"
            onClick={() => handleDeleteArticle(item.idArticle)}
          >
            ×
          </button>
        )}
      </li>
    ));
  };

  return (
    <div className="w-full h-full p-5 shadow-lg rounded-lg border border-gray-200 bg-white">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">文章列表</h2>

      <div className="mb-6">
        <input
          ref={placeholderInputRef}
          type="text"
          className="w-full px-2 py-1 text-sm border border-dashed border-gray-300 rounded outline-none focus:ring-2 focus:ring-blue-300"
          placeholder="在此输入标题，然后按 Enter 创建新文章 (Esc 取消)"
          value={tempTitle}
          onChange={(e) => setTempTitle(e.target.value)}
          onKeyDown={handlePlaceholderKeyDown}
        />
      </div>

      {drafts.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xs font-bold text-gray-600 mb-2">草稿</h3>
          <ul className="space-y-1">{renderList(drafts)}</ul>
        </div>
      )}

        {audit.length > 0 && (
        <div>
          <h3 className="text-xs font-bold text-gray-600 mb-2">审核中</h3>
          <ul className="space-y-1">{renderList(audit)}</ul>
        </div>
      )}
      {published.length > 0 && (
        <div>
          <h3 className="text-xs font-bold text-gray-600 mb-2">已发布</h3>
          <ul className="space-y-1">{renderList(published)}</ul>
        </div>
      )}
    </div>
  );
};

export default Sidebar;