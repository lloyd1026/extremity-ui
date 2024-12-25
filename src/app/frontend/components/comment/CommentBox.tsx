// src/components/CommentForm.tsx
import React, { useState } from 'react';

interface CommentFormProps {
    onSubmit: (content: string) => void;
    placeholder?: string;
    initialContent?: string;
    onCancel?: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ onSubmit, placeholder = "输入你的问题", initialContent = '', onCancel }) => {
    const [content, setContent] = useState<string>(initialContent);

    const handleSubmit = () => {
        if (!content.trim()) {
            alert("Content cannot be empty!");
            return;
        }
        onSubmit(content);
        setContent('');
    };

    return (
        <div style={{ marginTop: "10px" }}>
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
                style={{ width: "100%", padding: "5px" }}
                placeholder={placeholder}
            />
            <div>
                <button onClick={handleSubmit} style={{ marginTop: "5px" }}>
                    提交
                </button>
                {onCancel && (
                    <button onClick={onCancel} style={{ marginTop: "5px", marginLeft: "5px" }}>
                        取消
                    </button>
                )}
            </div>
        </div>
    );
};

export default CommentForm;
