export class CategoryContent {
  id: string;
  blogId: string;
  parentCategoryId?: string;
  categoryTitle: string;
  constructor(
    id: string = '',
    blogId: string = null,
    parentCategoryId: string = null,
    categoryTitle: string = '',
  ){
    this.id = id;
    this.blogId = blogId,
    this.parentCategoryId = parentCategoryId;
    this.categoryTitle = categoryTitle;
  }
}
