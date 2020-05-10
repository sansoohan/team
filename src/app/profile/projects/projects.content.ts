export class ProjectsContent {
  projects: Array<ProjectDescription>;
  constructor(
    projects: Array<ProjectDescription> = [new ProjectDescription()]
  ){
    this.projects = projects;
  }
}

export class ProjectDescription {
  organization: string;
  projectName: string;
  memberNum: number;
  position: string;
  startedAt: firebase.firestore.Timestamp | Date;
  finishedAt: firebase.firestore.Timestamp | Date;
  taskDescriptions: Array<string>;
  constructor(
    organization: string = '',
    projectName: string = '',
    memberNum: number = 0,
    position: string = '',
    startedAt: firebase.firestore.Timestamp | Date = null,
    finishedAt: firebase.firestore.Timestamp | Date = null,
    taskDescriptions: Array<string> = ['']
  ){
    this.organization = organization;
    this.projectName = projectName;
    this.memberNum = memberNum;
    this.position = position;
    this.startedAt = startedAt;
    this.finishedAt = finishedAt;
    this.taskDescriptions = taskDescriptions;
  }
}
