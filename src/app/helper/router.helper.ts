import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RouterHelper {
  constructor(
    private router: Router,
  ) { }

  goToCategory(params: any, categoryId: string): void {
    this.router.onSameUrlNavigation = 'reload';
    const currentUser = JSON.parse(localStorage.currentUser || null);
    const queryUser = currentUser?.userName || currentUser?.uid || params?.userName;
    this.router.navigate(['/blog', queryUser, 'categories', categoryId]).finally(() => {
      this.router.onSameUrlNavigation = 'ignore'; // Restore config after navigation completes
    });
  }

  goToPost(params: any, postId: string): void {
    this.router.onSameUrlNavigation = 'reload';
    const currentUser = JSON.parse(localStorage.currentUser || null);
    const queryUser = currentUser?.userName || currentUser?.uid || params?.userName;
    this.router.navigate(['/blog', queryUser, 'post', postId]).finally(() => {
      this.router.onSameUrlNavigation = 'ignore'; // Restore config after navigation completes
    });
  }
  scrollToProfile(params: any , profileTitle: string): void {
    this.router.onSameUrlNavigation = 'reload';
    const currentUser = JSON.parse(localStorage.currentUser || null);
    const queryUser = currentUser?.userName || currentUser?.uid || params?.userName;
    this.router.navigate(['/profile', queryUser], { fragment: profileTitle }).finally(() => {
      this.router.onSameUrlNavigation = 'ignore'; // Restore config after navigation completes
    });
  }
}
