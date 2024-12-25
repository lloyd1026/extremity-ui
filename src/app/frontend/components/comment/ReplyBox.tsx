// src/components/ReplyItem.tsx
import React, { useState } from 'react';
import { commentDetails, formatTimestamp } from "../info";
import UserAvatar from './UserAvatar';
import { User } from '../info';
import { useAuth } from "../auth/authcontext";
import userwithRoles from "@/interfaces/userwithRoles";
import request from "@/utils/request";
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
        <div
            style={{
                marginBottom: "10px",
                padding: "5px",
                backgroundColor: "#f9f9f9",
                border: "1px solid #ddd",
            }}
        >
            <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                <UserAvatar user={user} size={30} />
                <div>
                    <span style={{ color: "gray" }}>
                        {user.account || "Anonymous"} 
                        {parentAccount ? ` > Replying to ${parentAccount}` : ""}
                    </span>
                    <br />
                    {reply.comment}
                </div>
            </div>
            <div style={{ color: "gray" }}>
                {formatTimestamp(reply.updatedAt)}
            </div>
            {auth?.scope[0] === 3 && (
                <button onClick={() => setShowReplyForm(!showReplyForm)}>
                    Reply
                </button>
            )}

            {showReplyForm && (
                <CommentForm
                    onSubmit={handleReply}
                    onCancel={() => setShowReplyForm(false)}
                    placeholder="输入你的回复"
                />
            )}
        </div>
    );
};

export default ReplyItem;
