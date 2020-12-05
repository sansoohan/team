export class BlogContent {
  id: string;
  userName: string;
  constructor(
    id: string = '',
    userName: string = '',
  ){
    this.id = id;
    this.userName = userName;
  }
}
