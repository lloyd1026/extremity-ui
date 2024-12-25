import React, { useRef } from 'react';
import { Editor, EditorRef } from '../editor/editor';

const ParentComponent = () => {
  const editorRef = useRef<EditorRef>(null);

  const handleButtonClick = () => {
    if (editorRef.current) {
      const editorInstance = editorRef.current.getEditor();
      console.log(editorInstance.getHTML()); // 获取编辑器内容的 HTML
    }
  };

  return (
    <div>
      <Editor ref={editorRef} content="<p>Hello, World!</p>" />
      <button onClick={handleButtonClick}>Get Editor Content</button>
    </div>
  );
};

export default ParentComponent;
