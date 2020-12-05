import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ToastHelper } from '../helper/toast.helper';
import { BlogContent } from '../blog/blog.content';
import { PostContent } from '../blog/post/post.content';
import { CategoryContent } from '../blog/category/category.content';
import { CommentContent } from '../blog/post/comment/comment.content';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  blogContentsObserver: Observable<BlogContent[]> = null;
  postContentsObserver: Observable<PostContent[]> = null;
  profileUpdateState: string = null;
  userName: string = null;

  constructor(private firestore: AngularFirestore, private toast: ToastHelper) { }

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

  async updateBlog(updatedBlogContent: BlogContent): Promise<void> {
    return this.firestore.doc(`blogs/${updatedBlogContent.id}`).update(updatedBlogContent);
  }
  async updateCategory(blogId: string, updatedCategoryContent: CategoryContent): Promise<void> {
    return this.firestore
    .doc(`blogs/${blogId}/comments/${updatedCategoryContent.id}`)
    .update(updatedCategoryContent);
  }
  async updatePost(blogId: string, updatedPostContent: PostContent): Promise<void> {
    return this.firestore
    .doc(`blogs/${blogId}/posts/${updatedPostContent.id}`)
    .update(updatedPostContent);
  }
  async updateComment(blogId: string, updatedCommentContent: CommentContent): Promise<void> {
    return this.firestore
    .doc(`blogs/${blogId}/comments/${updatedCommentContent.id}`)
    .update(updatedCommentContent);
  }

  deleteBlog(blogId): void {
    this.firestore.doc(`blogs/${blogId}`).delete();
  }
  deleteCategory(blogId, categoryId): void {
    this.firestore.doc(`blogs/${blogId}/categories/${categoryId}`).delete();
  }
  deletePost(blogId, postId): void {
    this.firestore.doc(`blogs/${blogId}/posts/${postId}`).delete();
  }
  deleteComment(blogId, commentId): void {
    this.firestore.doc(`blogs/${blogId}/comments/${commentId}`).delete();
  }
}
