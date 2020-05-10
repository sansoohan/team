export class SkillsContent {
  skillGroups: Array<SkillGroup>;
  constructor(
    skillGroups: Array<SkillGroup> = [new SkillGroup()]
  ){
    this.skillGroups = skillGroups;
  }
}

export class SkillGroup {
  skillGroupName: string;
  skills: Array<SkillDescription>;
  constructor(
    skillGroupName: string = '',
    skills: Array<SkillDescription> = [new SkillDescription()]
  ){
    this.skillGroupName = skillGroupName;
    this.skills = skills;
  }
}

export class SkillDescription {
  devicon: string;
  skillName: string;
  term: string;
  constructor(
    devicon: string = '',
    skillName: string = '',
    term: string = ''
  ){
    this.devicon = devicon;
    this.skillName = skillName;
    this.term = term;
  }
}
