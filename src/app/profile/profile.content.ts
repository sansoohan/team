import { AboutContent } from './about/about.content';
import { AdditaionProfileContent } from './additional-profiles/additional-profile.content';
import { SkillsContent } from './skills/skills.content';
import { ProjectsContent } from './projects/projects.content';
import { InterestsContent } from './interests/interests.content';
import { EducationsContent } from './education/educations.content';

export class ProfileContent {
  id: string;
  ownerId: string;
  userName?: string;
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
