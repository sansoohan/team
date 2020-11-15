export class BlogContent {
  id: string;
  ownerId: string;
  userName?: string;
  blogImageSrc?: string;
  blogTitle: string;
  constructor(
    id: string = '',
    ownerId: string = '',
    userName: string = '',
    blogImageSrc: string = '',
    blogTitle: string = '',
  ){
    this.id = id;
    this.ownerId = ownerId;
    this.userName = userName;
    this.blogImageSrc = blogImageSrc;
    this.blogTitle = blogTitle;
  }
}
