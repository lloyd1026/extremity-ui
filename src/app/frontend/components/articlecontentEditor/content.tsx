"use client";
import React, { useEffect, useRef, useState } from "react";
import { Editor, EditorRef } from "@/components/editor";
import { browserFileTable } from "@/components/editor/lib/browser-file-table";
import instance from "@/utils/request";
import { toast } from "react-toastify";
import Modal from "antd/es/modal/Modal";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../loading/loading";
import { Form, Input, Select, Upload, Button } from "antd";
import type { UploadProps } from "antd/es/upload";
import { UploadOutlined } from "@ant-design/icons";
import config from "@/config/baseurl_config";
import { useRouter } from "next/navigation";

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
      // Base64
      const file = base64ToFile(src);
      const uploadKey = generateUploadKey();
      node.attrs.src = uploadKey; // 在 JSON 中记录
      imageMap[uploadKey] = file; // 在映射表中保存 File
    } else if (browserFileTable[src]) {
      // 本地缓存
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

export default function Content({ id }: { id: string }) {
  const editorRef = useRef<EditorRef>(null);

  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // 用于预览、回显当前封面
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  // 用于存储(新)封面上传文件
  const [coverFile, setCoverFile] = useState<File | null>(null);

  // AntD 表单
  const [form] = Form.useForm();

  const route = useRouter()
  /**
   * 1. 获取文章的“正文”内容（草稿JSON），并回显到编辑器中
   */
  useEffect(() => {
    const getContent = async () => {
      try {
        const response = await instance.get(`/article/Draft/${id}`);
        if (!response || !response.data.success) {
          toast.error("获取内容失败！请稍后重试！");
          return;
        }

        if (!editorRef.current) return;
        const editor = editorRef.current.getEditor();
        editor.commands.setContent(response.data.data);
      } catch (error) {
        toast.error("获取内容异常！");
      }
    };
    getContent();
    setIsMounted(true);
  }, [id]);

  /**
   * 2. 保存富文本内容：把所有图片抽取并用 FormData 上传
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
        toast.error("上传失败！请稍后重试！");
        return;
      }
      // 后端会返回更新后的 JSON，再 set 回编辑器
      const updatedJson = response.data.data;
      editor.commands.setContent(updatedJson);
      toast.success("上传成功!");
    } catch (error) {
      toast.error("上传失败！请稍后重试！");
    }
  };

  /**
   * 3. 点击“编辑文章详细信息”按钮时，先获取文章的摘要、类型、标签、封面等，再回显到 Form 表单
   */
  const handleEdit = async () => {
    try {
      const response = await instance.get(`/article/DraftCompendium/${id}`);
      if (!response.data.success) {
        toast.error("获取信息失败");
        return;
      }

      // 回显摘要、标签、类型
      form.setFieldValue("summary", response.data.data.articlePreviewContent);
      form.setFieldValue("articleType", Number(response.data.data.articleType) || 0);

      if (response.data.data.articleTags) {
        form.setFieldValue("tags", response.data.data.articleTags.split(","));
      }

      // 封面预览
      const thumbnailUrl = response.data.data.articleThumbnailUrl;
      if (thumbnailUrl) {
        setCoverUrl(config.baseUrl + thumbnailUrl);
      } else {
        setCoverUrl(null);
      }

      // 每次点击编辑时，把 coverFile 清空，以免残留
      setCoverFile(null);

      setIsOpen(true);
    } catch (error) {
      toast.error("获取信息失败");
    }
  };

  /**
   * 4. Modal 中“确定”按钮
   *    将摘要、类型、标签、封面等一起上传到后端
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

      // 3) 发请求
      const response = await instance.post("/article/DraftCompendium", formData
      );

      if (response.data.success) {
        toast.success("文章信息更新成功！");
        setIsOpen(false);
        // 更新封面预览
        if (coverFile) {
          setCoverUrl(URL.createObjectURL(coverFile));
        }
      } else {
        toast.error(response.data.message || "提交失败");
      }
    } catch (error) {
      // 如果是表单没通过校验，会直接抛异常到这里
      toast.error("请检查必填项是否填写完整");
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

  return (
    <div className="container mx-auto">
      {isMounted ? (
        <>
          <Editor ref={editorRef} />
          <div className="flex flex-col justify-center mt-6 gap-4">
            {/* 1. 保存富文本内容 */}
            <button
              onClick={handleUpload}
              className="h-12 w-full py-2 text-center text-base font-medium bg-orange-50 rounded-lg shadow-lg hover:bg-orange-100 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              保存富文本内容
            </button>

            {/* 2. 编辑文章摘要、类型、标签、封面等 */}
            <button
              onClick={handleEdit}
              className="h-12 w-full py-2 text-center text-base font-medium bg-orange-50 rounded-lg shadow-lg hover:bg-orange-100 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              编辑文章详细信息
            </button>

            <button
              onClick={()=>{
                route.push(`/frontend/preview/${id}`)
              }}
              className="h-12 w-full py-2 text-center text-base font-medium bg-orange-50 rounded-lg shadow-lg hover:bg-orange-100 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              预览
            </button>

          </div>
        </>
      ) : (
        <Loading />
      )}

      {/* 弹窗：编辑文章细则 */}
      <Form form={form}>
      </Form>
      <Modal
        getContainer={false}
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
                  src={URL.createObjectURL(coverFile)}
                  alt="预览封面"
                  style={{ maxWidth: "100%", maxHeight: 200, marginBottom: 8 }}
                />
                <div>{coverFile.name}</div>
              </div>
            ) : coverUrl ? (
              // 如果没有选择新文件，但后端有返回封面，就显示后端原本的封面
              <div style={{ marginBottom: 8 }}>
                <img
                  src={coverUrl}
                  alt="当前封面"
                  style={{ maxWidth: "100%", maxHeight: 200, marginBottom: 8 }}
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
    </div>
  );
}