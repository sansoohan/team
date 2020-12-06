export class CommentContent {
  id: string;
  postId?: string;
  writerId: string;
  writerName: string;
  parentId?: string;
  createdAt: number;
  commentMarkdown: string;
  commentImageSrcs: any;
  commentNumber?: number;
  likes: Array<string>;
  collapsed: boolean;
  deepCount?: number;
  hidden: boolean;
  ownerId: string;
  constructor(
    postId: string = null,
    writerId: string = '',
    writerName: string = '',
    parentId: string = null,
    createdAt: number = Number(new Date()),
    commentMarkdown: string = '',
    commentImageSrcs: any = [],
    commentNumber: number = null,
    likes: Array<string> = [],
    collapsed: boolean = false,
    deepCount: number = null,
    hidden: boolean = false,
    ownerId: string = '',
  ){
    this.postId = postId;
    this.writerId = writerId;
    this.writerName = writerName;
    this.parentId = parentId;
    this.createdAt = createdAt,
    this.commentMarkdown = commentMarkdown;
    this.commentImageSrcs = commentImageSrcs;
    this.commentNumber = commentNumber;
    this.likes = likes;
    this.collapsed = collapsed;
    this.deepCount = deepCount;
    this.hidden = hidden;
    this.ownerId = ownerId;
  }
}
