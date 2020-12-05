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
  ownerId: string;
  constructor(
    id: string = '',
    categoryId: string = '',
    commentCount: number = 0,
    createdAt: number = Number(new Date()),
    postTitle: string = '',
    postMarkdown: string = '',
    postImageSrcs: any = [],
    readCount: number = 0,
    selectedIamgeIndex: number = null,
    likes: any = [],
    ownerId: string = '',
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
    this.ownerId = ownerId;
  }
}
