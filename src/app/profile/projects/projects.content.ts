interface ProjectsContent {
  projects: Array<ProjectDescription>;
}

interface ProjectDescription {
  organization: string;
  projectName: string;
  memberNum: number;
  position: string;
  startedAt: firebase.firestore.Timestamp;
  finishedAt: firebase.firestore.Timestamp;
  taskDescriptions: Array<string>;
}
