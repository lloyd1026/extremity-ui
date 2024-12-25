// src/components/ReplyList.tsx
import React from 'react';
import { commentDetails, User } from "../info";
import ReplyItem from './ReplyBox';

interface ReplyListProps {
    replies: commentDetails[];
    users: { [key: number]: User };
    commentMap: { [key: number]: commentDetails };
    onReply: (parentId: number, rootCommentId: number) => void;
    onSubmitReply: (parentId: number, rootCommentId: number, replyId: number, content: string) => void;
}

const ReplyList: React.FC<ReplyListProps> = ({ replies, users, commentMap, onReply, onSubmitReply }) => {
    return (
        <div style={{ marginLeft: "20px", marginTop: "10px" }}>
            {replies.map((reply) => {
                const parentComment = reply.parentId ? commentMap[reply.parentId] : null;
                const parentAccount = parentComment ? (users[parentComment.userId]?.account || "Anonymous") : "";
                const user = users[reply.userId] || { account: "Unknown", avatarUrl: "" };

                return (
                    <ReplyItem
                        key={reply.id}
                        reply={reply}
                        user={user}
                        parentAccount={parentAccount}
                        onReply={onReply}
                        onSubmitReply={onSubmitReply}
                    />
                );
            })}
        </div>
    );
};

export default ReplyList;
