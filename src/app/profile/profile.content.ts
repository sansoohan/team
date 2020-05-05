interface ProfileContent {
  id: string;
  ownerId: string;
  roles: any;
  profileImageSrc?: string;
  profileTitle: string;
  aboutContent: AboutContent;
  educationsContent: EducationsContent;
  interestsContent: InterestsContent;
  projectsContent: ProjectsContent;
  skillsContent: SkillsContent;
  additaionProfilesContent: Array<AdditaionProfileContent>;
}
