export interface User{
    email:string;
    account:string;
    realName:string;
    phone:string;
    sex:string;
    avatarUrl:string;
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
export interface Article {
    idArticle: number; // 对应 Long 类型
    articleTitle: string;
    articleThumbnailUrl: string;
    articleAuthorId: number; // 对应 Long 类型
    articleType: string;
    articleTags: string;
    articleViewCount: number;
    articlePreviewContent: string;
    articleCommentCount: number;
    articlePerfect: string; // 0: 一般, 1: 精选
    articlePermalink: string;
    articleLink: string;
    createdTime: Date;
    updatedTime: Date;
    articleStatus: string;
    articleThumbsUpCount: number;
  }
