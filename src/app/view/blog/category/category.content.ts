export class CategoryContent {
  id: string;
  blogId: string;
  categoryNumber?: number;
  categoryTitle: string;
  createdAt: number;
  collapsed: boolean;
  parentId?: string;
  hidden: boolean;
  ownerId: string;
  constructor(
    id: string = '',
    blogId: string = '',
    categoryNumber: number = 0,
    categoryTitle: string = '',
    createdAt: number = Number(new Date()),
    collapsed: boolean = false,
    parentId: string = null,
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
    this.hidden = hidden;
    this.ownerId = ownerId;
  }
}
