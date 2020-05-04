import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private firestore: AngularFirestore) { }

  // updateProfile(updatedProfileContent: ProfileContent, profileContentsObserver: Observable<ProfileContent[]>): void {
  //   profileContentsObserver.subscribe(profileContents => {
  //     this.firestore.collection('profiles').doc(profileContents[0].id).update(updatedProfileContent);
  //   });
  // }

  createNewProfile(profileContent: ProfileContent): void {
    profileContent.ownerId = JSON.parse(localStorage.currentUser).uid;
    this.firestore.collection('profiles').add(profileContent)
    .then(doc => {
      profileContent.id = doc.id;
      doc.update(profileContent);
    });
  }

  getProfileContentsObserver(): Observable<ProfileContent[]> {
    const userId = '110306208655561059071';
    const profileContentsObserver: Observable<ProfileContent[]> = this.firestore
    .collection<ProfileContent>('profiles', ref => ref.where('ownerId', '==', userId))
    .valueChanges();

    return profileContentsObserver;
  }

  deleteProfile(): void {
    const userId = JSON.parse(localStorage.currentUser).uid;
    const profilesCollection = this.firestore
    .collection<ProfileContent>('profiles', ref => ref.where('id', '==', userId));
    const profileContentsObserver: Observable<ProfileContent[]> = profilesCollection.valueChanges();
    profileContentsObserver.subscribe(res => {
      this.firestore.collection<ProfileContent>('profiles').doc(res[0].id).delete();
    });
  }
}
