interface EducationsContent {
  educations: Array<EducationContent>;
}

interface EducationContent {
  organization: string;
  degree: string;
  descriptions: Array<string>;
  startedAt: firebase.firestore.Timestamp;
  finishedAt: firebase.firestore.Timestamp;
}
