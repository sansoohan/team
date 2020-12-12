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
    
    if(codeLineStartEndIndexes.length % 2 === 1) {
      codeLineStartEndIndexes.pop();
    }
    let codeLineNumbers = []
    for(let i=0; i < codeLineStartEndIndexes.length; i+=2){
      codeLineNumbers = [...codeLineNumbers, ...this.range(codeLineStartEndIndexes[i], codeLineStartEndIndexes[i+1], 1)]
    }

    const retLineString = lines.map((line, i) => {
      if(!line){
        return line + '&NewLine;<br>\n'
      }
      if(codeLineNumbers.includes(i)){
        return `\n${line}${codeLineNumbers.includes(i+1) ? '' : '\n'}`
      }
      return line + '<br>\n'
    })
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
  replaceToDateRecursively(content: any): any{
    if (content instanceof Array){
      for (let i = 0; i < content.length; i++){
        if (content[i] instanceof firebase.firestore.Timestamp){
          content[i] = content[i].toDate();
        }
        else{
          this.replaceToDateRecursively(content[i]);
        }
      }
    }
    else if (content instanceof Object) {
      for (const key in content){
        if (key){
          if (content[key] instanceof firebase.firestore.Timestamp){
            content[key] = content[key].toDate();
          }
          else{
            this.replaceToDateRecursively(content[key]);
          }
        }
      }
    }
    return content;
  }

  compareByOrderRecursively(contentA: any, contentB: any): number{
    const recursiveDeepCount: number = Math.max(contentA.order.length, contentB.order.length);
    for(let orderIndex = 0; orderIndex < recursiveDeepCount; orderIndex++){
      const orderA: number = contentA.order[orderIndex] || 0;
      const orderB: number = contentB.order[orderIndex] || 0;
      if(orderA === orderB && orderA !== 0) {
        continue;
      }

      return orderA - orderB;
    }
  }
}
