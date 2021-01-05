import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { FormHelper } from 'src/app/helper/form.helper';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { MeetingContent } from 'src/app/view/meeting/meeting.content';
import { RoomContent } from 'src/app/view/meeting/room/room.content';

@Injectable({
  providedIn: 'root'
})
export class MeetingService {

  constructor(
    private firestore: AngularFirestore,
  ) { }

  getTalkContentsObserver({params = null}): Observable<MeetingContent[]> {
    const currentUser = JSON.parse(localStorage.currentUser || null);
    const queryUserName = currentUser?.userName || params?.userName;
    return this.firestore
    .collection<MeetingContent>('talks', ref => ref.where('userName', '==', queryUserName))
    .valueChanges();
  }

  getRoomsObserver(talkId: string): Observable<RoomContent[]> {
    if (!talkId){
      return;
    }
    return this.firestore
    .collection<MeetingContent>('talks').doc(talkId)
    .collection<RoomContent>('rooms').valueChanges();
  }

  async delete(path: string): Promise<void> {
    return this.firestore.doc(path).delete();
  }
}
