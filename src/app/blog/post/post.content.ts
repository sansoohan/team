export class PostContent {
  id: string;
  categoryId: string;
  commentCount: number;
  createdAt: number;
  postTitle: string;
  postMarkdown: string;
  postImageSrcs: any;
  readCount: number;
  selectedIamgeIndex?: number;
  likes: any;
  constructor(
    id: string = '',
    categoryId: string = '',
    commentCount: number = 0,
    createdAt: number = null,
    postTitle: string = '',
    postMarkdown: string = '',
    postImageSrcs: any = [],
    readCount: number = 0,
    selectedIamgeIndex: number = null,
    likes: any = [],
  ){
    this.id = id;
    this.categoryId = categoryId;
    this.commentCount = commentCount;
    this.createdAt = createdAt,
    this.postTitle = postTitle;
    this.postMarkdown = postMarkdown;
    this.postImageSrcs = postImageSrcs;
    this.readCount = readCount;
    this.selectedIamgeIndex = selectedIamgeIndex;
    this.likes = likes;
  }
}
