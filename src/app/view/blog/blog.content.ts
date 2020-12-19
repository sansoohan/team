export class BlogContent {
  id: string;
  userName: string;
  ownerId: string;
  categoryOrder: Array<string>;
  constructor(
    id: string = '',
    userName: string = '',
    ownerId: string = '',
    categoryOrder: Array<string> = [],
  ){
    this.id = id;
    this.userName = userName;
    this.ownerId = ownerId;
    this.categoryOrder = categoryOrder;
  }
}
