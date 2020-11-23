export class CategoryContent {
  id: string;
  blogId?: string;
  categoryNumber?: number;
  categoryTitle: string;
  createdAt?: number;
  collapsed: boolean;
  deepCount?: number;
  parentId?: string;
  postCount: number;
  hidden: boolean;
  constructor(
    blogId: string = null,
    categoryNumber: number = null,
    categoryTitle: string = '',
    createdAt: number = Number(new Date()),
    collapsed: boolean = false,
    deepCount: number = null,
    parentId: string = null,
    postCount: number = 0,
    hidden: boolean = false,
  ){
    this.blogId = blogId;
    this.categoryNumber = categoryNumber;
    this.categoryTitle = categoryTitle;
    this.createdAt = createdAt;
    this.collapsed = collapsed;
    this.deepCount = deepCount;
    this.parentId = parentId;
    this.postCount = postCount;
    this.hidden = hidden;
  }
}
