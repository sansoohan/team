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
  startedAt: string;
  finishedAt: string;
  constructor(
    organization: string = '',
    degree: string = '',
    descriptions: Array<string> = [''],
    startedAt: string = null,
    finishedAt: string = null
  ){
    this.organization = organization;
    this.degree = degree;
    this.descriptions = descriptions;
    this.startedAt = startedAt;
    this.finishedAt = finishedAt;
  }
}
