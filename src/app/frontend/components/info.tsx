export interface User{
    email:string;
    account:string;
    realName:string;
    phone:string;
    sex:string;
    avatarUrl:string;
}

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