import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class DataTransferHelper {
  constructor(
  ) { }

  numberToArray(input: number): Array<any>{
    return new Array(input);
  }
  numberToDateString(input: number): string{
    const date = new Date(input);
    return `${date.getFullYear()}. ${date.getMonth()}. ${date.getDate()}`;
  }
  replaceToDateRecursively(profileContent: any): any{
    if (profileContent instanceof Array){
      for (let i = 0; i < profileContent.length; i++){
        if (profileContent[i] instanceof firebase.firestore.Timestamp){
          profileContent[i] = profileContent[i].toDate();
        }
        else{
          this.replaceToDateRecursively(profileContent[i]);
        }
      }
    }
    else if (profileContent instanceof Object) {
      for (const key in profileContent){
        if (key){
          if (profileContent[key] instanceof firebase.firestore.Timestamp){
            profileContent[key] = profileContent[key].toDate();
          }
          else{
            this.replaceToDateRecursively(profileContent[key]);
          }
        }
      }
    }
    return profileContent;
  }
}
