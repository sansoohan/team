export class PostContent {
  id: string;
  categoryId: string;
  postTitle: string;
  postMarkdown: string;
  postImageSrcs: any;
  selectedIamgeIndex?: number;
  constructor(
    id: string = '',
    categoryId: string = '',
    postTitle: string = '',
    postMarkdown: string = '',
    postImageSrcs: any = [],
    selectedIamgeIndex: number = null,
  ){
    this.id = id;
    this.categoryId = categoryId;
    this.postTitle = postTitle;
    this.postMarkdown = postMarkdown;
    this.postImageSrcs = postImageSrcs;
    this.selectedIamgeIndex = selectedIamgeIndex;
  }
}
