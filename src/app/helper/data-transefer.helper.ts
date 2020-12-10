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

  range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1}, (_, i) => start + (i * step));

  markDownPreprocess(input: string): string {
    const lines = input.split('\n')
    const codeLineStartEndIndexes = lines.map((line, i) =>
      line.split('```').length % 2 === 0
        ? i
        : null).filter((num) => num !== null);
    
    console.log(codeLineStartEndIndexes)
    if(codeLineStartEndIndexes.length % 2 === 1) {
      codeLineStartEndIndexes.pop();
    }
    let codeLineNumbers = []
    for(let i=0; i < codeLineStartEndIndexes.length; i+=2){
      codeLineNumbers = [...codeLineNumbers, ...this.range(codeLineStartEndIndexes[i], codeLineStartEndIndexes[i+1], 1)]
    }
    console.log(codeLineNumbers)

    const retLineString = lines.map((line, i) => {
      if(!line){
        return line + '&NewLine;<br>\n'
      }
      if(codeLineNumbers.includes(i)){
        return `\n${line}${codeLineNumbers.includes(i+1) ? '' : '\n'}`
      }
      return line + '<br>\n'
    })
    console.log(retLineString)
    return retLineString.join('')
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
