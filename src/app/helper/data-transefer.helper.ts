import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { MatchMedia } from '@angular/flex-layout/core/typings/match-media';

@Injectable({
  providedIn: 'root'
})
export class DataTransferHelper {
  constructor(
  ) { }

  numberToArray(input: number): Array<any>{
    return new Array(input);
  }
  numberToDateString(input: number): string {
    const SECOND = 1000;
    const MINUTE = 60 * SECOND;
    const HOUR = 60 * MINUTE;
    const DAY = 24 * HOUR;
    const now = Number(new Date());
    if (now - input < 2 * SECOND) { return `${Math.floor((now - input) / SECOND)} second ago`; }
    if (now - input < MINUTE) { return `${Math.floor((now - input) / SECOND)} seconds ago`; }
    if (now - input < 2 * MINUTE) { return `${Math.floor((now - input) / MINUTE)} minute ago`; }
    if (now - input < HOUR) { return `${Math.floor((now - input) / MINUTE)} minutes ago`; }
    if (now - input < 2 * HOUR) { return `${Math.floor((now - input) / HOUR)} hour ago`; }
    if (now - input < DAY) { return `${Math.floor((now - input) / HOUR)} hours ago`; }
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
