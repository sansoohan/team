interface SkillsContent {
  skillGroups: Array<SkillGroup>;
}

interface SkillGroup {
  skillGroupName: string;
  skills: Array<SkillDescription>;
}

interface SkillDescription {
  devicon: string;
  skillName: string;
  term: string;
}
