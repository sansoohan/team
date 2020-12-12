export class CommentContent {
  id: string;
  postId?: string;
  userName: string;
  parentId?: string;
  createdAt?: number;
  order: Array<number>;
  commentMarkdown: string;
  commentImageSrcs: any;
  likes: Array<string>;
  collapsed: boolean;
  deepCount?: number;
  hidden: boolean;
  ownerId: string;
  constructor(
    id: string = '',
    postId: string = '',
    userName: string = '',
    parentId: string = '',
    createdAt: number = 0,
    order: Array<number> = [],
    commentMarkdown: string = '',
    commentImageSrcs: any = [],
    likes: Array<string> = [],
    collapsed: boolean = false,
    deepCount: number = 0,
    hidden: boolean = false,
    ownerId: string = '',
  ){
    this.id = id;
    this.postId = postId;
    this.userName = userName;
    this.parentId = parentId;
    this.createdAt = createdAt,
    this.order = order,
    this.commentMarkdown = commentMarkdown;
    this.commentImageSrcs = commentImageSrcs;
    this.likes = likes;
    this.collapsed = collapsed;
    this.deepCount = deepCount;
    this.hidden = hidden;
    this.ownerId = ownerId;
  }
}
