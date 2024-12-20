export interface User{
    token:string
    account:string
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
    article_thumbs_up_count:number;
}