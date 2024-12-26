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
        <div className="mb-5 border border-gray-300 p-4 rounded-md bg-white shadow-sm">
            {/* Comment Header */}
            <div className="flex items-start mb-2">
                <UserAvatar user={user} />
                <div className="ml-3 flex-1">
                    <span className="text-gray-700 font-semibold">
                        {user.account || "Anonymous"}
                    </span>
                    <p className="mt-1 text-gray-800">{comment.comment}</p>
                </div>
            </div>
            {/* Timestamp */}
            <div className="text-sm text-gray-500">
                {formatTimestamp(comment.updatedAt)}
            </div>
            {/* Actions */}
            <div className="flex items-center mt-2">
                <button
                    onClick={() => onToggleReplies(comment.id)}
                    className="text-blue-500 hover:text-blue-700 text-sm focus:outline-none"
                    aria-expanded={replies ? "true" : "false"}
                >
                    {replies ? "隐藏回复" : "展开回复"}
                </button>
                {
                    auth?.scope[0] === 2 && (
                        <button
                            onClick={() => setIsReplying(!isReplying)}
                            className="ml-4 text-blue-500 hover:text-blue-700 text-sm focus:outline-none"
                        >
                            回复
                        </button>
                    )
                }
            </div>
            {/* Reply Form */}
            {isReplying && (
                <div className="mt-4">
                    <CommentForm
                        onSubmit={handleReply}
                        onCancel={() => setIsReplying(false)}
                        placeholder="输入你的回复"
                    />
                </div>
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
