import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { RouterHelper } from 'src/app/helper/router.helper';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private routerHelper: RouterHelper,
  ) {
  }

  goToProfile(params: any): void {
  }
  goToBlogPrologue(params: any): void {
  }
  goToMeeting(params: any): void {
    const { userName: ownerName } = this.authService.getCurrentUser();
    this.routerHelper.goToMeeting({
      userName: params?.userName || ownerName || 'sansoohan' });
  }

  ngOnInit(): void {
  }

}
