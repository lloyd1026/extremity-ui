// src/components/CommentItem.tsx
import React, { useState } from 'react';
import { commentDetails, User, formatTimestamp } from "../info";
import UserAvatar from './UserAvatar';
import ReplyList from './ReplyList';
import CommentForm from './CommentBox';
import { useAuth } from '../auth/authcontext';
import userwithRoles from '@/interfaces/userwithRoles';

interface CommentItemProps {
    comment: commentDetails;
    user: User;
    replies: commentDetails[] | undefined;
    users: { [key: number]: User };
    commentMap: { [key: number]: commentDetails };
    onToggleReplies: (commentId: number) => void;
    onSetReplyingTo: (commentId: number | null) => void;
    onSubmitReply: (parentId: number, rootCommentId: number, replyId: number, content: string) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
    comment,
    user,
    replies,
    users,
    commentMap,
    onToggleReplies,
    onSetReplyingTo,
    onSubmitReply,
}) => {
    const [isReplying, setIsReplying] = useState<boolean>(false);
    const { auth } = useAuth() as { auth: userwithRoles };
    const handleReply = (content: string) => {
        onSubmitReply(comment.id, comment.rootCommentId, comment.id, content);
        setIsReplying(false);
    };

    return (
        <div 
            style={{ marginBottom: "20px", border: "1px solid #ccc", padding: "10px" }}
        >
            {/* Comment Header */}
            <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                <UserAvatar user={user} />
                <div>
                    <span style={{ color: "gray", fontWeight: 'bold' }}>
                        {user.account || "Anonymous"}
                    </span>
                    <br />
                    {comment.comment}
                    <br />
                </div>
            </div>
            <div style={{ color: "gray" }}>
                {formatTimestamp(comment.updatedAt)}
            </div>
            {/* Toggle Replies */}
            <button onClick={() => onToggleReplies(comment.id)}>
                {replies ? "隐藏回复" : "展开回复"}
            </button>
            {/* Reply Button */}
            {/* Assuming `auth?.scope[0] === 3` is handled in parent or passed as a prop */}
            {
                auth?.scope[0]===3&&(
                <button onClick={() => setIsReplying(!isReplying)} style={{ marginLeft: '10px' }}>
                    回复
                </button>
                )
            }
            
            {/* Reply Form */}
            {isReplying && (
                <CommentForm
                    onSubmit={handleReply}
                    onCancel={() => setIsReplying(false)}
                    placeholder="输入你的回复"
                />
            )}
            {/* Replies */}
            {replies && replies.length > 0 && (
                <ReplyList
                    replies={replies}
                    users={users}
                    commentMap={commentMap}
                    onReply={onToggleReplies}
                    onSubmitReply={onSubmitReply}
                />
            )}
        </div>
    );
};

export default CommentItem;
