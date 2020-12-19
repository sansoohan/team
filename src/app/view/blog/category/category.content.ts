export class CategoryContent {
  id: string;
  blogId?: string;
  categoryNumber?: number;
  categoryTitle: string;
  createdAt?: number;
  collapsed: boolean;
  parentId?: string;
  postCreatedAtList: Array<number>;
  hidden: boolean;
  ownerId: string;
  constructor(
    id: string = '',
    blogId: string = null,
    categoryNumber: number = null,
    categoryTitle: string = '',
    createdAt: number = Number(new Date()),
    collapsed: boolean = false,
    parentId: string = null,
    postCreatedAtList: Array<number> = [],
    hidden: boolean = false,
    ownerId: '',
  ){
    this.id = id;
    this.blogId = blogId;
    this.categoryNumber = categoryNumber;
    this.categoryTitle = categoryTitle;
    this.createdAt = createdAt;
    this.collapsed = collapsed;
    this.parentId = parentId;
    this.postCreatedAtList = postCreatedAtList;
    this.hidden = hidden;
    this.ownerId = ownerId;
  }
}
