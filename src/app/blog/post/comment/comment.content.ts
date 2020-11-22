export class CommentContent {
  id: string;
  postId: string;
  commentMarkdown: string;
  likes: any;
  constructor(
    id: string = '',
    postId: string = '',
    commentMarkdown: string = '',
    likes: any = [],
  ){
    this.id = id;
    this.postId = postId,
    this.commentMarkdown = commentMarkdown;
    this.likes = likes;
  }
}
