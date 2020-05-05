import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { profileDefault } from '../profile/profile.default';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  profileUpdateState: string = null;

  constructor(private firestore: AngularFirestore) { }

  // updateProfile(updatedProfileContent: ProfileContent, profileContentsObserver: Observable<ProfileContent[]>): void {
  //   profileContentsObserver.subscribe(profileContents => {
  //     this.firestore.collection('profiles').doc(profileContents[0].id).update(updatedProfileContent);
  //   });
  // }

  hasProfile(hasProfile = false){
    this.getProfileContentsObserver().subscribe(profileContents => {
      profileContents.forEach(profileContent => {
        hasProfile = true;
      });
    });
    return hasProfile;
  }

  createNewProfile(): void {
    if (this.profileUpdateState !== 'deleteProfile'){
      this.getProfileContentsObserver().subscribe(profileContents => {
        if (localStorage.currentUser && profileContents.length === 0){
          profileDefault.ownerId = JSON.parse(localStorage.currentUser).uid;
          this.firestore.collection('profiles').add(profileDefault)
          .then(doc => {
            profileDefault.id = doc.id;
            doc.update(profileDefault);
          });
        }
      });
    }
  }

  getProfileContentsObserver(): Observable<ProfileContent[]> {
    const userId = JSON.parse(localStorage.currentUser).uid;
    const profileContentsObserver: Observable<ProfileContent[]> = this.firestore
    .collection<ProfileContent>('profiles', ref => ref.where('ownerId', '==', userId))
    .valueChanges();

    return profileContentsObserver;
  }

  deleteProfile(): void {
    this.profileUpdateState = 'deleteProfile';
    const userId = JSON.parse(localStorage.currentUser).uid;
    this.firestore.collection<ProfileContent>('profiles',  ref => ref
      .where('ownerId', '==', userId)
    )
    .get()
    .subscribe(querySnapshot => {
      querySnapshot.forEach(doc => {
        this.firestore.doc(`profiles/${doc.id}`).delete();
        // doc.get(doc.id).delete();
          // doc.data() is never undefined for query doc snapshots
          // console.log(doc.id, " => ", doc.data());
      });
    });
  }
}
