import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { profileDefault } from '../profile/profile.default';
import { MessageService } from './message.service';
import { ProfileContent } from '../profile/profile.content';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  profileUpdateState: string = null;

  constructor(private firestore: AngularFirestore, private message: MessageService) { }

  updateProfile(updatedProfileContent: ProfileContent, profileContentsObserver: Observable<ProfileContent[]>) {
    this.firestore.collection('profiles').doc(updatedProfileContent.id).update(updatedProfileContent)
    .then(() => {
      this.message.showSuccess('Profile Update', 'Success!');
    })
    .catch(e => {
      console.log(e);
      this.message.showWarning('Profile Update Failed.', e);
    });
  }

  createNewProfile(): void {
    if (this.profileUpdateState !== 'deleteProfile'){
      const userId = JSON.parse(localStorage.currentUser).uid;
      const userEmail = JSON.parse(localStorage.currentUser).email;
      const userPhoneNumber = JSON.parse(localStorage.currentUser).phoneNumber;
      const userPhoneUrl = JSON.parse(localStorage.currentUser).photoURL;
      const userFirstName = JSON.parse(localStorage.currentUser).displayName.split(' ')[0];
      const userLastName = JSON.parse(localStorage.currentUser).displayName.split(' ')[1];
      profileDefault.roles[userId] = 'owner';
      profileDefault.ownerId = userId;
      profileDefault.profileTitle = `${userId}'s Title`;
      profileDefault.aboutContent.userName = userId;
      profileDefault.aboutContent.firstName = userFirstName;
      profileDefault.aboutContent.lastName = userLastName;
      profileDefault.aboutContent.email = userEmail;
      profileDefault.aboutContent.phoneNumber = userPhoneNumber;
      profileDefault.profileImageSrc = userPhoneUrl ? userPhoneUrl : '';
      this.getProfileContentsObserver(userId).subscribe(profileContents => {
        if (localStorage.currentUser && profileContents.length === 0){
          this.firestore.collection('profiles').add(profileDefault)
          .then(doc => {
            profileDefault.id = doc.id;
            doc.update(profileDefault);
          });
        }
      });
    }
  }

  getProfileContentsObserver(userName?: string): Observable<ProfileContent[]> {
    let profileContentsObserver: Observable<ProfileContent[]>;
    if (userName){
      profileContentsObserver = this.firestore
      .collection<ProfileContent>('profiles', ref => ref
      .where(new firebase.firestore.FieldPath('aboutContent', 'userName'), '==', userName))
      .valueChanges();
    }
    else {
      const userId = JSON.parse(localStorage.currentUser).uid;
      profileContentsObserver = this.firestore
      .collection<ProfileContent>('profiles', ref => ref.where('ownerId', '==', userId))
      .valueChanges();
    }
    return profileContentsObserver;
  }

  deleteProfile(updatedProfileContent): void {
    this.firestore.doc(`profiles/${updatedProfileContent.id}`).delete();
  }
}
