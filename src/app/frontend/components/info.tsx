export interface User{
    email:string;
    account:string;
    realName:string;
    phone:string;
    sex:string;
    avatarUrl:string;
}

export interface articleDetails{
    id:number;
    articleTitle:string;
    article_thumbnail_url:string;
    article_author_id:number;
    article_type:string;
    article_tags:string;
    article_view_count:number;
    article_preview_content:string;
    article_comment_count:number;
    article_permalink:string;
    article_link:string;
    created_time:string;
    updated_time:string;
    article_perfect:string;
    article_status:string;
    article_thumbs_u_count:number;
}

export interface commentDetails{
    id:number;
    userId:number;
    comment:string;
    parentId:number;
    rootCommentId:number;
    createdAt:string;
    updatedAt:string;
}

export const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 补齐两位
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
export const formatTimestamp = (timestamp:string) => {
    const date = new Date(timestamp); // 将时间戳转换为 Date 对象
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 补齐两位
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`; // 返回格式化后的时间字符串
};