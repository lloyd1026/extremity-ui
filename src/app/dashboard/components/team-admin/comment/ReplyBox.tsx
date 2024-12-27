// src/components/ReplyItem.tsx
import React, { useState } from 'react';
import { commentDetails, formatTimestamp } from "@/app/frontend/components/info";
import UserAvatar from './UserAvatar';
import { User } from "@/app/frontend/components/info";
import { useAuth } from "@/app/dashboard/components/auth/authcontext";
import userwithRoles from "@/interfaces/userwithRoles";
import CommentForm from './CommentBox';

interface ReplyItemProps {
    reply: commentDetails;
    user: User;
    parentAccount?: string;
    onReply: (parentId: number, rootCommentId: number) => void;
    onSubmitReply: (parentId: number, rootCommentId: number, replyId: number, content: string) => void;
}

const ReplyItem: React.FC<ReplyItemProps> = ({ reply, user, parentAccount, onReply, onSubmitReply }) => {
    const [showReplyForm, setShowReplyForm] = useState<boolean>(false);
    const { auth } = useAuth() as { auth: userwithRoles };

    const handleReply = (content: string) => {
        onSubmitReply(reply.id, reply.rootCommentId, reply.id, content);
        setShowReplyForm(false);
    };

    return (
        <div className="mb-4 p-4 bg-gray-100 border border-gray-300 rounded-md shadow-sm">
            {/* Reply Header */}
            <div className="flex items-start mb-2">
                <UserAvatar user={user} size={30} />
                <div className="ml-3 flex-1">
                    <span className="text-gray-600 font-semibold">
                        {user.account || "Anonymous"} 
                        {parentAccount && (
                            <span className="text-gray-500"> &gt; 回复 {parentAccount}</span>
                        )}
                    </span>
                    <p className="mt-1 text-gray-700">{reply.comment}</p>
                </div>
            </div>
            {/* Timestamp */}
            <div className="text-sm text-gray-500">
                {formatTimestamp(reply.updatedAt)}
            </div>
            {/* Actions */}
            {auth?.scope[0] === 2 && (
                <div className="mt-2">
                    <button
                        onClick={() => setShowReplyForm(!showReplyForm)}
                        className="text-blue-500 hover:text-blue-700 text-sm focus:outline-none"
                        aria-expanded={showReplyForm ? "true" : "false"}
                        aria-controls={`reply-form-${reply.id}`}
                    >
                        {showReplyForm ? "取消回复" : "回复"}
                    </button>
                </div>
            )}
            {/* Reply Form */}
            {showReplyForm && (
                <div className="mt-4 transition-opacity duration-300 ease-in-out opacity-100">
                    <CommentForm
                        onSubmit={handleReply}
                        onCancel={() => setShowReplyForm(false)}
                        placeholder="输入你的回复"
                    />
                </div>
            )}
        </div>
    );
};

export default ReplyItem;
