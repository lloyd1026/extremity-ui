'use client'; // 确保这是一个 Client Component
import React, { useState, useEffect } from 'react';
import EasyMDE from 'easymde';
import 'easymde/dist/easymde.min.css'; // 引入 EasyMDE 样式
import markdownIt from 'markdown-it';

const MarkdownEditor = () => {
  const [markdownContent, setMarkdownContent] = useState('');
  const [editor, setEditor] = useState<EasyMDE | null>(null);
  const [files, setFiles] = useState<File[]>([]); // 暂存上传的文件
  const [filePreviews, setFilePreviews] = useState<{ [key: string]: string }>({}); // 文件名与文件链接的映射

  // 初始化 EasyMDE 编辑器
  useEffect(() => {
    const easyMDE = new EasyMDE({
      element: document.getElementById('markdownEditor')!, // 使用类型断言
      autoDownloadFontAwesome: true,
      showIcons: ['bold', 'italic', 'heading', 'quote', 'unordered-list', 'ordered-list', 'link'],
      spellChecker: false,
      status: false,
      previewRender: function (plainText: string) {
        return markdownIt().render(plainText); // 渲染预览
      },
    });
    setEditor(easyMDE);

    easyMDE.codemirror.on('change', function () {
      setMarkdownContent(easyMDE.value()); // 实时更新内容
    });
  }, []);

  // 处理文件选择并暂存文件
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      const newFiles = Array.from(selectedFiles);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
      setFilePreviews((prev) => {
        const newPreviews = newFiles.reduce((acc, file) => {
          // 如果文件是 PDF 或其他浏览器可以查看的格式，生成对应的文件 URL
          acc[file.name] = URL.createObjectURL(file); // 使用 URL.createObjectURL 显示本地文件预览
          return acc;
        }, {} as { [key: string]: string });
        return { ...prev, ...newPreviews };
      });
    }
  };

  // 保存时上传文件和 Markdown 内容
  const handleSave = async () => {
    // 将 Markdown 转换为 HTML
    const md = markdownIt();
    const htmlContent = md.render(markdownContent);

    // 创建 FormData 用于上传
    const formData = new FormData();
    formData.append('markdownContent', htmlContent); // 将 HTML 内容加入 FormData

    // 添加文件到 FormData
    files.forEach((file) => {
      formData.append('files', file);
    });

    console.log(formData.get("markdownContent"));
    formData.forEach((value, key) => {
      if (key === 'files') {
        // 这是文件字段
        if (value instanceof File) {
          console.log(`File Name: ${value.name}`);
          console.log(`File Size: ${value.size} bytes`);
          console.log(`File Type: ${value.type}`);
        }
      }
    });
  
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Markdown 编辑器</h2>

      {/* Markdown 编辑器 */}
      <textarea
        id="markdownEditor"
        className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="在这里编写 Markdown..."
        value={markdownContent}
        onChange={(e) => setMarkdownContent(e.target.value)}
      ></textarea>

      {/* 文件上传部分 */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">上传附件 (PDF/Word/图片等)</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <label className="cursor-pointer text-white bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded-md">
              选择文件
              <input
                type="file"
                accept=".pdf, .doc, .docx, .jpg, .jpeg, .png, .gif"
                className="hidden"
                onChange={handleFileSelect} // 处理文件选择
              />
            </label>
            <span className="text-gray-500">支持 PDF, Word, 图片等格式</span>
          </div>
        </div>
      </div>

      {/* 显示已选择的附件 */}
      <div className="mt-6">
        {files.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-2">已选择的附件</h3>
            <ul className="space-y-2">
              {files.map((file, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <a
                    href={filePreviews[file.name]} // 这里使用了 Blob URL，用户可以点击查看
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {file.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 保存按钮 */}
      <div className="mt-6 text-center">
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          保存
        </button>
      </div>
    </div>
  );
};

export default MarkdownEditor;
