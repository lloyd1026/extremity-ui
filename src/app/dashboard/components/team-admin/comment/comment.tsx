// // src/components/CommentSection.tsx
// 'use client';

// import React, { useEffect, useState } from "react";
// import request from "@/utils/request";
// import { commentDetails, formatDate, User } from "@/app/frontend/components/info";
// // import config from "@/config/baseurl_config";
// import { useAuth } from "@/app/dashboard/components/auth/authcontext";
// import userwithRoles from "@/interfaces/userwithRoles";
// import CommentItem from './CommentItem';
// import CommentForm from './CommentBox';

// const PAGE_SIZE = 5; // 每页显示五条顶级评论
// interface CommentSectionProps {
//     articleId: number;
// }

// const CommentSection: React.FC <CommentSectionProps> = ({ articleId }) => {
//     const [topComments, setTopComments] = useState<commentDetails[]>([]);
//     const [replys, setReplys] = useState<{ [key: number]: commentDetails[] }>({});
//     const [userDetails, setUserDetails] = useState<{ [key: number]: User }>({});
//     const [commentMap, setCommentMap] = useState<{ [key: number]: commentDetails }>({});
//     const [replyingTo, setReplyingTo] = useState<number | null>(null);
//     // const [loading, setLoading] = useState<boolean>(false);
//     const { auth } = useAuth() as { auth: userwithRoles };
//     const defaultAvatar = '/default-avatar.png';
//     const [currentPage, setCurrentPage] = useState<number>(1);
//     const [totalPages, setTotalPages] = useState<number>(1);

//     // Fetch user details
//     const fetchUserDetails = async (userId: number) => {
//         if (userDetails[userId]) return;
//         try {
//             const response = await request.get(`/user/id`, { params: { id: userId } });
//             if (response.data.success) {
//                 setUserDetails((prev) => ({
//                     ...prev,
//                     [userId]: response.data.data,
//                 }));
//             }
//         } catch (error) {
//             console.error(`Failed to fetch user details for userId: ${userId}`, error);
//             setUserDetails((prev) => ({
//                 ...prev,
//                 [userId]: { account: "Unknown", avatarUrl: defaultAvatar } as User,
//             }));
//         }
//     };

//     // Store comments in map
//     const storeCommentsInMap = (comments: commentDetails[]) => {
//         setCommentMap((prev) => {
//             const newMap = { ...prev };
//             comments.forEach((c) => {
//                 newMap[c.id] = c;
//             });
//             return newMap;
//         });
//     };

//     // Fetch top-level comments
//     const fetchTopComment = async () => {
//         try {
//             const response = await request.get<{ success: boolean; data: commentDetails[] }>(`/comment/articleId`);
//             if (response.data.success) {
//                 const comments: commentDetails[] = response.data.data;
//                 setTopComments(comments);
//                 setTotalPages(Math.ceil(comments.length / PAGE_SIZE));
//                 setCurrentPage(1); // 初始化为第一页
//                 storeCommentsInMap(comments);

//                 const userIds: number[] = [...new Set(comments.map((comment) => comment.userId))];
//                 const userRequests = userIds.map((id) => fetchUserDetails(id));
//                 await Promise.allSettled(userRequests);
//             }
//         } catch (error) {
//             console.error("Failed to fetch top comments:", error);
//         }
//     };

//     // Toggle replies
//     const handleToggleReplies = async (id: number) => {
//         if (replys[id]) {
//             setReplys((prev) => {
//                 const newReplys = { ...prev };
//                 delete newReplys[id];
//                 return newReplys;
//             });
//             return;
//         }

//         try {
//             const response = await request.get<{ success: boolean; data: commentDetails[] }>(`/comment/commentId`, { params: { commentId: id } });
//             if (response.data.success) {
//                 const replies = response.data.data as commentDetails[];
                
//                 setReplys((prev) => ({
//                     ...prev,
//                     [id]: replies,
//                 }));
//                 storeCommentsInMap(replies);

//                 const replyUserIds: number[] = [...new Set(replies.map((reply) => reply.userId))];
//                 const userRequests = replyUserIds.map((userId) => fetchUserDetails(userId));
//                 await Promise.allSettled(userRequests);
//             }
//         } catch (error) {
//             console.error("Failed to fetch replies:", error);
//         }
//     };

//     // Handle submitting a reply
//     const handleSubmitReply = async (parentId: number, rootCommentId: number, replyId: number, content: string) => {
//         if (!content.trim()) {
//             alert("Reply content cannot be empty!");
//             return;
//         }
//         try {
//             const comment: commentDetails = {
//                 id: 0, 
//                 userId: auth?.idUser as number,
//                 comment: content,
//                 parentId: rootCommentId === 0 ? 0 : parentId,
//                 rootCommentId: rootCommentId === 0 ? parentId : rootCommentId,
//                 createdAt: formatDate(new Date()),
//                 updatedAt: formatDate(new Date()),
//                 articleId: articleId
//             };
//             const response = await request.post(`/comment/add`, comment);

//             if (response.data.success) {
//                 const newReply: commentDetails = {
//                     ...comment,
//                     id: Date.now(), // 使用时间戳模拟唯一 ID
//                 };

//                 setReplys((prev) => ({
//                     ...prev,
//                     [rootCommentId === 0 ? parentId : rootCommentId]: prev[rootCommentId === 0 ? parentId : rootCommentId] 
//                         ? [...prev[rootCommentId === 0 ? parentId : rootCommentId], newReply] 
//                         : [newReply],
//                 }));
//                 storeCommentsInMap([newReply]);
//                 await fetchUserDetails(newReply.userId);
//             } else {
//                 alert("Failed to submit reply. Please try again.");
//             }
//         } catch (error) {
//             console.error("Failed to submit reply:", error);
//             alert("Failed to submit reply. Please try again.");
//         }
//     };

//     // Handle submitting a top-level comment
//     const handleSubmitTopComment = async (content: string) => {
//         if (!content.trim()) {
//             alert("Comment content cannot be empty!");
//             return;
//         }
//         try {
//             const comment: commentDetails = {
//                 id: 0,
//                 userId: auth?.idUser as number,
//                 comment: content.trim(),
//                 parentId: 0,
//                 rootCommentId: 0,
//                 createdAt: formatDate(new Date()),
//                 updatedAt: formatDate(new Date()),
//                 articleId: articleId
//             };

//             const response = await request.post(`/comment/add`, comment);

//             if (response.data.success) {
//                 const newComment: commentDetails = {
//                     ...comment,
//                     id: Date.now(), // 使用时间戳模拟唯一 ID
//                 };

//                 setTopComments((prev) => [newComment, ...prev]);
//                 setTotalPages(Math.ceil((topComments.length + 1) / PAGE_SIZE));
//                 // 如果当前页是第一页，则添加新评论到当前页
//                 if (currentPage === 1) {
//                     // 确保只显示 PAGE_SIZE 条评论
//                     setTopComments((prev) => [newComment, ...prev].slice(0, PAGE_SIZE));
//                 }
//                 storeCommentsInMap([newComment]);
//                 await fetchUserDetails(newComment.userId);
//             } else {
//                 alert("Failed to submit comment. Please try again.");
//             }
//         } catch (error) {
//             console.error("Failed to submit comment:", error);
//             alert("Failed to submit comment. Please try again.");
//         }
//     };

//     const getCurrentPageComments = () => {
//         const start = (currentPage - 1) * PAGE_SIZE;
//         const end = start + PAGE_SIZE;
//         return topComments.slice(start, end);
//     };

//     const handlePageChange = (page: number) => {
//         if (page < 1 || page > totalPages) return;
//         setCurrentPage(page);
//     };

//     useEffect(() => {
//         fetchTopComment();
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, []);

//     return (
//         <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
//             {/* 标题 */}
//             <h2 className="text-2xl font-semibold mb-4 text-gray-800">在线问答</h2>

//             {/* 新评论表单 */}
//             {auth?.scope[0] === 4 && (
//                 <div className="mb-6">
//                     <CommentForm
//                         onSubmit={handleSubmitTopComment}
//                         placeholder="发表评论..."
//                     />
//                 </div>
//             )}

//             {/* 顶级评论列表 */}
//             <div className="space-y-4">
//                 {getCurrentPageComments().map((comment) => {
//                     const user = userDetails[comment.userId] || { account: "Unknown", avatarUrl: defaultAvatar };
//                     const repliesForComment = replys[comment.id];
//                     return (
//                         <CommentItem
//                             key={comment.id}
//                             comment={comment}
//                             user={user}
//                             replies={repliesForComment}
//                             users={userDetails}
//                             commentMap={commentMap}
//                             onToggleReplies={handleToggleReplies}
//                             onSetReplyingTo={setReplyingTo}
//                             onSubmitReply={handleSubmitReply}
//                         />
//                     );
//                 })}
//             </div>

//             {/* 分页控制 */}
//             {totalPages > 1 && (
//                 <div className="flex justify-center mt-6 space-x-2">
//                     <button
//                         onClick={() => handlePageChange(currentPage - 1)}
//                         disabled={currentPage === 1}
//                         className={`px-4 py-2 rounded-md text-sm font-medium ${
//                             currentPage === 1
//                                 ? "bg-gray-300 text-gray-700 cursor-not-allowed"
//                                 : "bg-blue-500 text-white hover:bg-blue-600"
//                         }`}
//                     >
//                         上一页
//                     </button>
//                     {/* 显示页码按钮 */}
//                     {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
//                         <button
//                             key={page}
//                             onClick={() => handlePageChange(page)}
//                             className={`px-4 py-2 rounded-md text-sm font-medium ${
//                                 currentPage === page
//                                     ? "bg-blue-700 text-white"
//                                     : "bg-blue-500 text-white hover:bg-blue-600"
//                             }`}
//                         >
//                             {page}
//                         </button>
//                     ))}
//                     <button
//                         onClick={() => handlePageChange(currentPage + 1)}
//                         disabled={currentPage === totalPages}
//                         className={`px-4 py-2 rounded-md text-sm font-medium ${
//                             currentPage === totalPages
//                                 ? "bg-gray-300 text-gray-700 cursor-not-allowed"
//                                 : "bg-blue-500 text-white hover:bg-blue-600"
//                         }`}
//                     >
//                         下一页
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default CommentSection;
