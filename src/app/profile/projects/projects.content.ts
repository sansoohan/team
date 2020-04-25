interface ProjectsContent {
  id: string;
  projects: Array<ProjectDescription>;
}

interface ProjectDescription {
  organization: string;
  projectName: string;
  memberNum: number;
  position: string;
  startedAt: Date;
  finishedAt: Date;
  taskDescriptions: Array<string>;
}
