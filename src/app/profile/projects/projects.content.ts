interface ProjectsContent {
  projects: Array<ProjectDescription>;
}

interface ProjectDescription {
  organization: string;
  projectName: string;
  memberNum: number;
  position: string;
  startedAt: firebase.firestore.Timestamp | Date;
  finishedAt: firebase.firestore.Timestamp | Date;
  taskDescriptions: Array<string>;
}
