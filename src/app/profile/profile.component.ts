import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileContentsObserver: Observable<ProfileContent[]>;

  constructor(private profileService: ProfileService) {
    this.profileContentsObserver = this.profileService.getProfileContentsObserver();
  }

  ngOnInit(): void {

  }
}
