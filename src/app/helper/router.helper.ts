import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class RouterHelper {
  constructor(
    private router: Router,
    private viewportScroller: ViewportScroller,
  ) { }

  goToUrl(url: string): void {
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([url.replace(`${window.location.origin}/#`, '')]).finally(() => {
      this.router.onSameUrlNavigation = 'ignore'; // Restore config after navigation completes
    });
  }

  goToMeeting(params: any): void {
    this.router.onSameUrlNavigation = 'reload';
    const currentUser = JSON.parse(localStorage.currentUser || null);
    const queryUser = currentUser?.userName || params?.userName;
    this.router.navigate([
      '/meeting', queryUser, params.roomId ? 'room' : null, params?.roomId,
    ].filter(Boolean)).finally(() => {
      this.router.onSameUrlNavigation = 'ignore'; // Restore config after navigation completes
    });
  }

  scrollToIdElement(profileTitle: string): void {
    setTimeout(() => {
      this.viewportScroller.scrollToAnchor(profileTitle);
    }, 10);
  }
}
