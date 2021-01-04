import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { FormHelper } from 'src/app/helper/form.helper';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { TalkContent } from '../view/talk/talk.content';
import { RoomContent } from '../view/talk/room/room.content';

@Injectable({
  providedIn: 'root'
})
export class TalkService {

  constructor(
    private firestore: AngularFirestore,
  ) { }

  getTalkContentsObserver({params = null}): Observable<TalkContent[]> {
    const currentUser = JSON.parse(localStorage.currentUser || null);
    const queryUserName = currentUser?.userName || params?.userName;
    return this.firestore
    .collection<TalkContent>('talks', ref => ref.where('userName', '==', queryUserName))
    .valueChanges();
  }

  getRoomsObserver(talkId: string): Observable<RoomContent[]> {
    if (!talkId){
      return;
    }
    return this.firestore
    .collection<TalkContent>('talks').doc(talkId)
    .collection<RoomContent>('rooms').valueChanges();
  }

  async delete(path: string): Promise<void> {
    return this.firestore.doc(path).delete();
  }
}
