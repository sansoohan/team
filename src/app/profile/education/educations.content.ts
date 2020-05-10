export class EducationsContent {
  educations: Array<EducationContent>;
  constructor(
    educations: Array<EducationContent> = [new EducationContent()]
  ){
    this.educations = educations;
  }
}

export class EducationContent {
  organization: string;
  degree: string;
  descriptions: Array<string>;
  startedAt: firebase.firestore.Timestamp | Date;
  finishedAt: firebase.firestore.Timestamp | Date;
  constructor(
    organization: string = '',
    degree: string = '',
    descriptions: Array<string> = [''],
    startedAt: firebase.firestore.Timestamp | Date = null,
    finishedAt: firebase.firestore.Timestamp | Date = null
  ){
    this.organization = organization;
    this.degree = degree;
    this.descriptions = descriptions;
    this.startedAt = startedAt;
    this.finishedAt = finishedAt;
  }
}
