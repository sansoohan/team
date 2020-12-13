import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { BlogContent } from '../view/blog/blog.content';
import { PostContent } from '../view/blog/post/post.content';
import { CategoryContent } from '../view/blog/category/category.content';
import { CommentContent } from '../view/blog/post/comment/comment.content';
import { AuthService } from './auth.service';
import { FormGroup, FormArray } from '@angular/forms';

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
  getProloguePostListObserver(blogId: string): Observable<PostContent[]> {
    if (!blogId){
      return;
    }
    return this.firestore
      .collection<BlogContent>('blogs').doc(blogId)
      .collection<PostContent>('posts', ref => ref.orderBy('createdAt', 'desc').limit(10))
      .valueChanges();
  }

  getCategoryPostListObserver(
    blogId: string,
    postCreatedAtList: Array<number>,
  ): Observable<PostContent[]> {
    if (!blogId){
      return;
    }
    if(postCreatedAtList.length === 0) {
      postCreatedAtList = [-1]
    }

    return this.firestore
      .collection<BlogContent>('blogs').doc(blogId)
      .collection<PostContent>('posts', ref => ref
        .where('createdAt', 'in', postCreatedAtList)
      )
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

  getCategoryDeepCount(
    categoryContent: any,
    categoryContents: Array<any>,
  ): number {
    // console.log(categoryContent)
    if(!categoryContent?.value.parentId){
      return 1
    }
    const parentCategory = categoryContents
    .find((category) => category.value.id === categoryContent.value.parentId)

    return 1 + this.getCategoryDeepCount(parentCategory, categoryContents)
  }

  async create(path: string, content: any): Promise<void> {
    if (!this.authService.isSignedIn()) {
      return null;
    }
    content.ownerId = JSON.parse(localStorage.currentUser).uid;

    return this.firestore.collection(path).add(content)
    .then(async (collection) => {
      content.id = collection.id;
      collection.update(content);
    });
  }

  async update(path: string, updated: any): Promise<void> {
    return this.firestore.doc(path).update(updated);
  }
  async delete(path: string): Promise<void> {
    return this.firestore.doc(path).delete();
  }
}
