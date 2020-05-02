interface EducationsContent {
  educations: Array<EducationContent>;
}

interface EducationContent {
  organization: string;
  degree: string;
  descriptions: Array<string>;
  startedAt: Date;
  finishedAt: Date;
}
