import React, { ChangeEvent, memo, useCallback, useRef, useState } from 'react';
import { Editor } from '@tiptap/core';
import { Toolbar } from '../ui/toolbar';
import { Icon } from '../ui/icon';
import { browserFileTable } from '../lib/browser-file-table';

interface MenuButtonImageProps {
  editor: Editor;
}

export const MenuButtonImage = ({ editor }: MenuButtonImageProps) => {
  // 用于「本地上传」的隐藏 <input type="file" />
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [externalImageUrl, setExternalImageUrl] = useState('');

  // 点击「插入本地图片」按钮时，触发 input.click()
  const handleClickSelectLocal = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // 当用户选择好本地图片后，会触发 onChange
  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      // 简单判断是否是图片类型
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        // 如果你有 file -> blob -> 后端存储的逻辑，可以把 file 缓存在一个全局表里
        browserFileTable[url] = file;
        // tiptap 插入图片
        editor.chain().focus().setImage({ src: url }).run();
      }
    },
    [editor]
  );

  // 更新外部链接输入
  const handleExternalUrlChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setExternalImageUrl(e.target.value);
    },
    []
  );

  // 插入外部链接图片
  const handleInsertExternalImage = useCallback(() => {
    if (!externalImageUrl.trim()) return;
      editor.chain().focus().setImage({ src: externalImageUrl.trim() }).run();
      setExternalImageUrl(''); // 清空输入框
  }, [externalImageUrl, editor]);

  return (
    <>
      {/** —— 方式1：本地图片 —— */}
      <Toolbar.Button tooltip="插入本地图片" onClick={handleClickSelectLocal}>
        <Icon name="Image" />
      </Toolbar.Button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/** —— 方式2：外部链接图片 —— */}
      <Toolbar.Group>
        <input
          type="text"
          placeholder="输入图片链接"
          value={externalImageUrl}
          onChange={handleExternalUrlChange}
          className="border p-1 rounded"
        />
        <Toolbar.Button tooltip="插入外部图片" onClick={handleInsertExternalImage}>
          <Icon name="Link" />
        </Toolbar.Button>
      </Toolbar.Group>
    </>
  );
};

export default memo(MenuButtonImage, (prevProps, nextProps) => {
  // 避免不必要的渲染
  return prevProps.editor === nextProps.editor;
});