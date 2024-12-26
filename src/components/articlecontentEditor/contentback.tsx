"use client";
import React, { useEffect, useRef, useState } from "react";
import { Editor, EditorRef } from "@/components/editor";
import { browserFileTable } from "@/components/editor/lib/browser-file-table";
import instance from "@/utils/request";
import { toast } from "react-toastify";
import Modal from "antd/es/modal/Modal";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../../app/frontend/components/loading/loading";
import { Form, Input, Select, Upload, Button } from "antd";
import type { UploadProps } from "antd/es/upload";
import { UploadOutlined } from "@ant-design/icons";
import config from "@/config/baseurl_config";
import { usePathname, useRouter } from "next/navigation";
import AttachmentManager from "./attachmentManager";

// 文章类型枚举
const articleTypeOptions = [
  { label: "科研文章", value: 0 },
  { label: "专著", value: 1 },
  { label: "专利", value: 2 },
  { label: "产品", value: 3 },
  { label: "软著", value: 4 },
];

/** 把 base64 转为 File */
function base64ToFile(base64: string, fileName = "image.png"): File {
  const [meta, data] = base64.split(",");
  const mimeMatch = meta.match(/data:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : "image/png";
  const binaryStr = atob(data);
  const len = binaryStr.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }
  return new File([bytes], fileName, { type: mime });
}

// 生成一个随机 key
function generateUploadKey() {
  return "img_" + Math.random().toString(36).slice(2, 10);
}

/** 递归处理编辑器中（JSON）的所有图片，找出需要上传的文件 */
function processImages(node: any, imageMap: Record<string, File>) {
  if (node.type === "image" && node.attrs?.src) {
    const { src } = node.attrs;

    if (src.startsWith("data:image/")) {
      try {
        const file = base64ToFile(src);
        const uploadKey = generateUploadKey();
        node.attrs.src = uploadKey; // 在 JSON 中记录
        imageMap[uploadKey] = file; // 在映射表中保存 File
      } catch (error) {
        console.error("Base64 转换失败", error);
      }
    } else if (browserFileTable[src]) {
      const file = browserFileTable[src];
      const uploadKey = generateUploadKey();
      node.attrs.src = uploadKey;
      imageMap[uploadKey] = file;
    }
    // 如果是纯网络图片 http/https，一般无需上传，不做处理
  }

  // 递归子节点
  if (Array.isArray(node.content)) {
    node.content.forEach((child) => processImages(child, imageMap));
  }
}

interface ArticleInfo {
  articlePreviewContent: string;
  articleType: number;
  articleTags: string;
  articleThumbnailUrl: string;
  articleStatus: string;
  // 其他字段...
}

export default function Content({ id }: { id: string }) {
  const editorRef = useRef<EditorRef>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // 用于预览、回显当前封面
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  // 用于存储(新)封面上传文件
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const [articleInfo, setArticleInfo] = useState<ArticleInfo | null>(null);
  // AntD 表单
  const [form] = Form.useForm();
  const pathname = usePathname();

  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [contentData, setContentData] = useState<any>(null);

  /**
   * 获取文章的“正文”内容（草稿JSON），并存储到 contentData 中
   */
  const getContent = async () => {
    try {
      console.log("Fetching content for id:", id);
      const response = await instance.get(`/article/Draft/${id}`);
      if (!response || !response.data.success) {
        toast.error("获取内容失败！请稍后重试！");
        return;
      }
      console.log("Content fetched:", response.data.data);
      setContentData(response.data.data);
    } catch (error: any) {
      console.log("Error fetching content:", error);
      toast.error("获取内容异常！");
    }
  };

  /**
   * 获取文章的摘要、类型、标签、封面等信息
   */
  const fetchArticleInfo = async () => {
    try {
      console.log("Fetching article info for id:", id);
      const response = await instance.get(`/article/DraftCompendium/${id}`);
      if (!response.data.success) {
        toast.error("获取信息失败");
        return false;
      }
      console.log("Article info fetched:", response.data.data);
      setArticleInfo(response.data.data);
      if (isOpen) {
        // 延迟设置表单字段值，避免在渲染期间同步更新状态
        Promise.resolve().then(() => {
          form.setFieldsValue({
            summary: response.data.data.articlePreviewContent,
            articleType: Number(response.data.data.articleType) || 0,
            tags: response.data.data.articleTags
              ? response.data.data.articleTags.split(",")
              : [],
          });
        });
      }
      // 封面预览
      const thumbnailUrl = response.data.data.articleThumbnailUrl;
      if (thumbnailUrl) {
        setCoverUrl(config.baseUrl + thumbnailUrl);
      } else {
        setCoverUrl(null);
      }
      setCoverFile(null);
      return true;
    } catch (error: any) {
      console.log("Error fetching article info:", error);
      toast.error(error.response?.data?.message || "获取信息失败");
      return false;
    }
  };

  /**
   * 综合获取文章信息和内容
   */
  const fetchData = async () => {
    console.log("Fetching data...");
    setLoading(true);
    try {
      await fetchArticleInfo();
      await getContent();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 初始加载
    fetchData();

    // 定义窗口获取焦点时的处理函数
    const handleFocus = () => {
      console.log("Window focused, fetching data...");
      fetchData();
    };

    // 监听窗口的 focus 事件
    window.addEventListener("focus", handleFocus);

    // 清理事件监听
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [id, pathname]);

  /**
   * 设置编辑器内容，当 contentData 和 editorRef.current 都准备好
   */
  useEffect(() => {
    if (contentData && editorRef.current) {
      const editor = editorRef.current.getEditor();
      if (editor) {
        console.log("Setting editor content");
        // 延迟设置内容，避免在渲染周期内调用 flushSync
        Promise.resolve().then(() => {
          editor.commands.setContent(contentData);
        });
      }
    }
  }, [contentData]);

  /**
   * 点击“保存富文本内容”按钮
   */
  const handleUpload = async () => {
    if (!editorRef.current) return;
    const editor = editorRef.current.getEditor();
    if (!editor) return;

    // 1) 获取编辑器 JSON
    const jsonContent = editor.getJSON();

    // 2) 找出其中所有需要上传的图片
    const imageMap: Record<string, File> = {};
    processImages(jsonContent, imageMap);

    // 3) 用 FormData 打包
    const formData = new FormData();
    // JSON 内容本身
    formData.append("contentJson", JSON.stringify(jsonContent));

    // 把图片文件加进去
    // 例如 "file_img_abcd1234" => File
    // 后端可根据字段名解析出 uploadKey = "img_abcd1234"
    Object.entries(imageMap).forEach(([uploadKey, file]) => {
      formData.append(`file_${uploadKey}`, file);
    });

    // 4) 发给后端
    try {
      const response = await instance.post(`/article/UpdateDraft/${id}`, formData);
      if (!response || !response.data.success) {
        toast.error(response.data.message || "上传失败！请稍后重试！");
        return;
      }
      // 后端会返回更新后的 JSON，再 set 回编辑器
      const updatedJson = response.data.data;
      editor.commands.setContent(updatedJson);
      toast.success("上传成功!");
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "上传失败！请稍后重试！";
      toast.error(errorMsg);
    }
  };

  /**
   * 点击“编辑文章详细信息”按钮
   */
  const handleEdit = async () => {
    const res = await fetchArticleInfo();
    if (res === true) {
      setIsOpen(true);
    }
  };

  /**
   * Modal 中“确定”按钮
   * 将摘要、类型、标签、封面等一起上传到后端
   */
  const handleOk = async () => {
    try {
      // 1) 先校验表单必填项
      const values = await form.validateFields();

      // 2) 准备 FormData
      const formData = new FormData();
      // 后端对应的 @RequestParam("idArticle")
      formData.append("idArticle", id);
      formData.append("summary", values.summary);
      formData.append("articleType", String(values.articleType || 0));
      // tags 用逗号拼接
      if (values.tags?.length) {
        formData.append("tags", values.tags.join(","));
      }
      // 如果选择了新封面，则上传新封面
      if (coverFile) {
        formData.append("coverFile", coverFile);
      }
      setConfirmLoading(true);
      const response = await instance.post("/article/DraftCompendium", formData);
      if (response.data.success) {
        toast.success("文章信息更新成功！");
        setIsOpen(false);
        // 更新封面预览
        if (coverFile) {
          setCoverUrl(URL.createObjectURL(coverFile));
        }
        // 刷新文章信息
        await fetchArticleInfo();
      } else {
        toast.error(response.data.message || "提交失败");
      }
    } catch (error: any) {
      // 如果是表单没通过校验，会直接抛异常到这里
      const errorMsg =
        error.response?.data?.message || "请检查必填项是否填写完整";
      toast.error(errorMsg);
    } finally {
      setConfirmLoading(false);
    }
  };

  // 取消按钮
  const handleCancel = () => {
    setIsOpen(false);
  };

  // 封面上传组件的 props
  const uploadProps: UploadProps = {
    beforeUpload: (file) => {
      // 在这里设置文件到 state，以便后续在 handleOk 里统一处理
      setCoverFile(file);
      // 阻止默认的自动上传，让你可以在 handleOk 里统一手动提交
      return false;
    },
    maxCount: 1,
  };

  useEffect(() => {
    if (coverFile) {
      const objectUrl = URL.createObjectURL(coverFile);
      setCoverUrl(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [coverFile]);

  return (
    <div className="container mx-auto">
        <>
          <Editor ref={editorRef} />
          <div className="w-10/12 flex flex-col justify-center mt-6 gap-4">
            <Button type="primary" onClick={handleUpload} className="h-12 w-full">
              保存富文本内容
            </Button>
            <Button onClick={handleEdit} className="h-12 w-full">
              编辑文章详细信息
            </Button>
          </div>
          <div className="w-10/12">
            <AttachmentManager draftId={id} canModify={true} />
          </div>
          <Modal
            title="编辑文章细则"
            open={isOpen}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            destroyOnClose
          >
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                summary: "",
                articleType: 0,
                tags: [],
              }}
            >
              <Form.Item
                label="文章摘要"
                name="summary"
                rules={[{ required: true, message: "请输入文章摘要" }]}
              >
                <Input.TextArea rows={4} placeholder="请输入文章摘要" />
              </Form.Item>

              <Form.Item
                label="文章类别"
                name="articleType"
                rules={[{ required: true, message: "请选择文章类别" }]}
              >
                <Select options={articleTypeOptions} placeholder="请选择文章类别" />
              </Form.Item>

              <Form.Item label="文章标签" name="tags">
                <Select
                  mode="tags"
                  style={{ width: "100%" }}
                  placeholder="请输入标签后回车"
                />
              </Form.Item>

              <Form.Item label="文章封面">
                {/* 如果当前已选择了新文件，就显示新文件的预览 */}
                {coverFile ? (
                  <div style={{ marginBottom: 8 }}>
                    <img
                      src={coverUrl || ""}
                      alt="预览封面"
                      style={{
                        maxWidth: "100%",
                        maxHeight: 200,
                        marginBottom: 8,
                      }}
                    />
                    <div>{coverFile.name}</div>
                  </div>
                ) : coverUrl ? (
                  // 如果没有选择新文件，但后端有返回封面，就显示后端原本的封面
                  <div style={{ marginBottom: 8 }}>
                    <img
                      src={coverUrl}
                      alt="当前封面"
                      style={{
                        maxWidth: "100%",
                        maxHeight: 200,
                        marginBottom: 8,
                      }}
                    />
                    <div>当前封面</div>
                  </div>
                ) : null}
                {/* 上传组件 */}
                <Upload {...uploadProps}>
                  <Button icon={<UploadOutlined />}>选择封面</Button>
                </Upload>
              </Form.Item>
            </Form>
          </Modal>
        </>
    </div>
  );
}