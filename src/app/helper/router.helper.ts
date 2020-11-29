import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RouterHelper {
  constructor(
    private router: Router,
  ) { }

  goToProfile(params: any): void {
    this.router.onSameUrlNavigation = 'reload';
    const currentUser = JSON.parse(localStorage.currentUser || null);
    const queryUser = currentUser?.userName || currentUser?.uid || params?.userName;
    this.router.navigate(['/profile', queryUser]).finally(() => {
      this.router.onSameUrlNavigation = 'ignore'; // Restore config after navigation completes
    });
  }

  goToBlogPrologue(params: any): void {
    this.router.onSameUrlNavigation = 'reload';
    const currentUser = JSON.parse(localStorage.currentUser || null);
    const queryUser = currentUser?.userName || currentUser?.uid || params?.userName;
    this.router.navigate(['/blog', queryUser]).finally(() => {
      this.router.onSameUrlNavigation = 'ignore'; // Restore config after navigation completes
    });
  }

  goToBlogCategory(params: any, categoryId: string): void {
    this.router.onSameUrlNavigation = 'reload';
    const currentUser = JSON.parse(localStorage.currentUser || null);
    const queryUser = currentUser?.userName || currentUser?.uid || params?.userName;
    this.router.navigate(['/blog', queryUser, 'category', categoryId]).finally(() => {
      this.router.onSameUrlNavigation = 'ignore'; // Restore config after navigation completes
    });
  }

  goToBlogPost(params: any, postId: string): void {
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
