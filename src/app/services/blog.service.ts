import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { BlogContent } from '../view/blog/blog.content';
import { PostContent } from '../view/blog/post/post.content';
import { CategoryContent } from '../view/blog/category/category.content';
import { CommentContent } from '../view/blog/post/comment/comment.content';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  blogContentsObserver: Observable<BlogContent[]> = null;
  postContentsObserver: Observable<PostContent[]> = null;
  profileUpdateState: string = null;
  userName: string = null;

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService,
  ) { }

  getCategoryPost(blogId: string, categoryIds: Array<number>): Observable<PostContent[]> {
    return this.firestore
    .collection<BlogContent>('blogs').doc(blogId)
    .collection<PostContent>('posts', ref => ref.where('categoryId', 'in', categoryIds))
    .valueChanges();
  }

  getBlogContentsObserver({params = null}): Observable<BlogContent[]> {
    if (!this.blogContentsObserver){
      const currentUser = JSON.parse(localStorage.currentUser || null);
      const queryUserName = currentUser?.userName || params?.userName;
      this.blogContentsObserver = this.firestore
      .collection<BlogContent>('blogs', ref => ref.where('userName', '==', queryUserName))
      .valueChanges();
    }
    return this.blogContentsObserver;
  }
  getPostContentsObserver({params = null}, blogId: string): Observable<PostContent[]> {
    const postId = params?.postId;
    if (!blogId || !postId){
      return;
    }
    return this.firestore
      .collection<BlogContent>('blogs').doc(blogId)
      .collection<PostContent>('posts', ref => ref.where('id', '==', postId))
      .valueChanges();
  }
  getPostListObserver(
    {params = null},
    blogId: string,
    categoryIds: Array<string>
  ): Observable<PostContent[]> {
    const categoryId = params?.categoryId;
    if (!blogId){
      return;
    }
    if (!categoryId) {
      return this.firestore
      .collection<BlogContent>('blogs').doc(blogId)
      .collection<PostContent>('posts', ref => ref.orderBy('createdAt', 'desc').limit(10))
      .valueChanges();
    }
    return this.firestore
      .collection<BlogContent>('blogs').doc(blogId)
      .collection<PostContent>('posts', ref => ref.where('categoryId', 'in', categoryIds))
      .valueChanges();
  }

  getCategoryContentsObserver(blogId: string): Observable<CategoryContent[]> {
    if (!blogId){
      return;
    }
    const categoryContentsObserver = this.firestore
    .collection<BlogContent>('blogs').doc(blogId)
    .collection<CategoryContent>('categories')
    .valueChanges();
    return categoryContentsObserver;
  }

  getCommentContentsObserver(
    blogId: string,
    postId: string,
  ): Observable<CommentContent[]> {
    if (!blogId || !postId){
      return;
    }
    const categoryContentsObserver = this.firestore
    .collection<BlogContent>('blogs').doc(blogId)
    .collection<CommentContent>('comments', ref => ref.where('postId', '==', postId))
    .valueChanges();
    return categoryContentsObserver;
  }

  async create(path: string, contentForm: any): Promise<void> {
    if (!this.authService.isSignedIn()) {
      return null;
    }

    return this.firestore.collection(path).add(contentForm.value)
    .then(async (collection) => {
      contentForm.controls.ownerId.setValue(JSON.parse(localStorage.currentUser).uid);
      contentForm.controls.id.setValue(collection.id);
      collection.update(contentForm.value);
    });
  }

  async update(path: string, updated: any): Promise<void> {
    return this.firestore.doc(path).update(updated);
  }
  async delete(path: string): Promise<void> {
    return this.firestore.doc(path).delete();
  }
}
