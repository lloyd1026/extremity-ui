'use client';

import React, { useEffect, useState } from "react";
import request from "@/utils/request";
import { commentDetails, formatDate, User } from "@/app/frontend/components/info";
import { useAuth } from "@/app/dashboard/components/auth/authcontext";
import userwithRoles from "@/interfaces/userwithRoles";
import CommentItem from '@/app/dashboard/components/team-admin/comment/CommentItem';
import { useSearchParams } from 'next/navigation';
const PAGE_SIZE = 5; // 每页显示五条顶级评论


// 定义 Article 数据类型
interface Article {
    idArticle: number;
    articleTitle: string;
    [key: string]: any; // 如果需要保留其他属性，可用索引签名
}

interface ArticleSummary {
    id: number;
    name: string;
}


const CommentSection2: React.FC = () =>{
    const [topComments, setTopComments] = useState<commentDetails[]>([]);
    const [replys, setReplys] = useState<{ [key: number]: commentDetails[] }>({});
    const [userDetails, setUserDetails] = useState<{ [key: number]: User }>({});
    const [commentMap, setCommentMap] = useState<{ [key: number]: commentDetails }>({});
    const [replyingTo, setReplyingTo] = useState<number | null>(null);
    const { auth } = useAuth() as { auth: userwithRoles };
    const defaultAvatar = '/default-avatar.png';
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [articleSummaries, setArticleSummaries] = useState<ArticleSummary[]>([]);
    const searchParams = useSearchParams();
    const articleId = searchParams.get('articleId');

    // Fetch user details
    const fetchUserDetails = async (userId: number) => {
        if (userDetails[userId]) return;
        try {
            const response = await request.get(`/user/id`, { params: { id: userId } });
            if (response.data.success) {
                setUserDetails((prev) => ({
                    ...prev,
                    [userId]: response.data.data,
                }));
            }
        } catch (error) {
            console.error(`Failed to fetch user details for userId: ${userId}`, error);
            setUserDetails((prev) => ({
                ...prev,
                [userId]: { account: "Unknown", avatarUrl: defaultAvatar } as User,
            }));
        }
    };

    // Store comments in map
    const storeCommentsInMap = (comments: commentDetails[]) => {
        setCommentMap((prev) => {
            const newMap = { ...prev };
            comments.forEach((c) => {
                newMap[c.id] = c;
            });
            return newMap;
        });
    };

    // Fetch top-level comments
    const fetchTopComment = async (articleId: number) => {
        try {
            const response = await request.get<{ success: boolean; data: commentDetails[] }>(`/comment/articleId`,{
                params :{articleId: articleId}
            });
            if (response.data.success) {
                // console.log(response.data.data);
                const comments: commentDetails[] = response.data.data;
                setTopComments(comments);
                setTotalPages(Math.ceil(comments.length / PAGE_SIZE));
                setCurrentPage(1); // 初始化为第一页
                storeCommentsInMap(comments);

                const userIds: number[] = [...new Set(comments.map((comment) => comment.userId))];
                const userRequests = userIds.map((id) => fetchUserDetails(id));
                await Promise.allSettled(userRequests);
            }
        } catch (error) {
            console.error("Failed to fetch top comments:", error);
        }
    };

    // Toggle replies
    const handleToggleReplies = async (id: number) => {
        if (replys[id]) {
            setReplys((prev) => {
                const newReplys = { ...prev };
                delete newReplys[id];
                return newReplys;
            });
            return;
        }

        try {
            const response = await request.get<{ success: boolean; data: commentDetails[] }>(`/comment/commentId`, { params: { commentId: id, articleId:articleId} });
            console.log("hello sucker" + response.data);
            if (response.data.success) {
                const replies = response.data.data as commentDetails[];
                
                setReplys((prev) => ({
                    ...prev,
                    [id]: replies,
                }));
                storeCommentsInMap(replies);

                const replyUserIds: number[] = [...new Set(replies.map((reply) => reply.userId))];
                const userRequests = replyUserIds.map((userId) => fetchUserDetails(userId));
                await Promise.allSettled(userRequests);
            }
        } catch (error) {
            console.error("Failed to fetch replies:", error);
        }
    };

    // Handle submitting a reply
    const handleSubmitReply = async (parentId: number, rootCommentId: number, replyId: number, content: string, articleId: number) => {
        if (!content.trim()) {
            alert("Reply content cannot be empty!");
            return;
        }
        try {
            const comment: commentDetails = {
                id: 0, 
                userId: auth?.idUser as number,
                comment: content,
                parentId: rootCommentId === 0 ? 0 : parentId,
                rootCommentId: rootCommentId === 0 ? parentId : rootCommentId,
                createdAt: formatDate(new Date()),
                updatedAt: formatDate(new Date()),
                articleId: articleId
            };
            const response = await request.post(`/comment/add`, comment);

            if (response.data.success) {
                const newReply: commentDetails = {
                    ...comment,
                    id: Date.now(), // 使用时间戳模拟唯一 ID
                };

                setReplys((prev) => ({
                    ...prev,
                    [rootCommentId === 0 ? parentId : rootCommentId]: prev[rootCommentId === 0 ? parentId : rootCommentId] 
                        ? [...prev[rootCommentId === 0 ? parentId : rootCommentId], newReply] 
                        : [newReply],
                }));
                storeCommentsInMap([newReply]);
                await fetchUserDetails(newReply.userId);
            } else {
                alert("Failed to submit reply. Please try again.");
            }
        } catch (error) {
            console.error("Failed to submit reply:", error);
            alert("Failed to submit reply. Please try again.");
        }
    };

    const getCurrentPageComments = () => {
        const start = (currentPage - 1) * PAGE_SIZE;
        const end = start + PAGE_SIZE;
        return topComments.slice(start, end);
    };
    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    useEffect(() => {
        // @ts-ignore
        fetchTopComment(articleId);
    }, []);
    
    return (
        <div>
            {/* List of Top-Level Comments */}
            {getCurrentPageComments().map((comment) => {
                const user = userDetails[comment.userId] || { account: "Unknown", avatarUrl: defaultAvatar };
                const repliesForComment = replys[comment.id];
                return (
                    <CommentItem
                        key={comment.id}
                        comment={comment}
                        user={user}
                        replies={repliesForComment}
                        users={userDetails}
                        commentMap={commentMap}
                        onToggleReplies={handleToggleReplies}
                        onSetReplyingTo={setReplyingTo}
                        onSubmitReply={handleSubmitReply}
                    />
                );
            })}


            {/* 分页控制 */}
            <div className="flex justify-center mt-6 space-x-2">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-md ${
                        currentPage === 1
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                >
                    上一页
                </button>
                {/* 显示页码按钮 */}
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                    <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1 rounded-md ${
                            currentPage === page
                                ? "bg-blue-700 text-white"
                                : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                    >
                        {page}
                    </button>
                ))}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-md ${
                        currentPage === totalPages
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                >
                    下一页
                </button>
            </div>
        </div>
    );
};

export default CommentSection2;
