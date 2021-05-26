export class AboutContent {
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
  email: string;
  social: Array<AboutSocial>;
  constructor(
    firstName: string = 'First Name',
    lastName: string = 'Last Name',
    address: string = 'Address',
    phoneNumber: string = '+00 00-0000-0000',
    email: string = 'your-email@gmail.com',
    social: Array<AboutSocial> = [
      new AboutSocial(
        'https://kr.linkedin.com/in/sansoo-han-29a40216a',
        'fa fa-linkedin',
      ),
      new AboutSocial(
        'https://github.com/sansoohan',
        'fa fa-github',
      ),
    ],
  ){
    this.firstName = firstName;
    this.lastName = lastName;
    this.address = address;
    this.phoneNumber = phoneNumber;
    this.email = email;
    this.social = social;
  }
}

export class AboutSocial {
  socialUrl: string;
  faIcon: string;
  constructor(
    socialUrl: string = '',
    faIcon: string = ''
  ){
    this.socialUrl = socialUrl;
    this.faIcon = faIcon;
  }
}

export class InterestsContent {
  descriptions: Array<string>;
  constructor(
    descriptions: Array<string> = [
      'Hadoop Distribute System',
      'Hacking technique for developer',
      'Bio Sensor for Input Device',
      'AI Programing',
    ]
  ){
    this.descriptions = descriptions;
  }
}


export class EducationsContent {
  educations: Array<EducationContent>;
  constructor(
    educations: Array<EducationContent> = [
      new EducationContent(
        'University of Dankook',
        'Bachelor of Computer Science',
        ['Software Enginneering', 'GPA: 3.02'],
        null,
        null
      ),
      new EducationContent(
        'BulGok High School',
        'Math/Science',
        [],
        null,
        null
      )
    ]
  ){
    this.educations = educations;
  }
}

export class EducationContent {
  organization: string;
  degree: string;
  descriptions: Array<string>;
  startedAt: string|null;
  finishedAt: string|null;
  constructor(
    organization: string = '',
    degree: string = '',
    descriptions: Array<string> = [''],
    startedAt: string|null = null,
    finishedAt: string|null = null,
  ){
    this.organization = organization;
    this.degree = degree;
    this.descriptions = descriptions;
    this.startedAt = startedAt;
    this.finishedAt = finishedAt;
  }
}

export class ProjectsContent {
  projects: Array<ProjectDescription>;

  public newProjectDescription: ProjectDescription = new ProjectDescription();

  constructor(
    projects: Array<ProjectDescription> = [
      new ProjectDescription(
        'Company',
        'ProjectName',
        2,
        'PM/PL/PG/SE/QA',
        null,
        null,
        [
          'Task Flow 1',
          'Task Flow 2'
        ]
      ),
    ]
  ){
    this.projects = projects;
  }
}

export class ProjectDescription {
  organization: string;
  projectName: string;
  memberNum: number;
  position: string;
  startedAt: string|null;
  finishedAt: string|null;
  taskDescriptions: Array<string>;
  constructor(
    organization: string = '',
    projectName: string = '',
    memberNum: number = 0,
    position: string = '',
    startedAt: string|null = null,
    finishedAt: string|null = null,
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

export class SkillsContent {
  skillGroups: Array<SkillGroup>;
  constructor(
    skillGroups: Array<SkillGroup> = [
      new SkillGroup(
        'Front End',
        [
          new SkillDescription('devicons devicons-html5', 'HTML', '?Years'),
          new SkillDescription('devicons devicons-css3', 'CSS', '?Years'),
          new SkillDescription('devicons devicons-javascript', 'Javascript', '?Years'),
          new SkillDescription('devicon-typescript-plain', 'Typescript', '?Year'),
          new SkillDescription('devicons devicons-bootstrap', 'Bootstrap', '?Years'),
          new SkillDescription('devicon-typescript-plain', 'Nativescript', '?Months'),
          new SkillDescription('devicon-angularjs-plain', 'Angular', '?Year'),
          new SkillDescription('devicon-vuejs-plain', 'Vuejs', '?Months'),
          new SkillDescription('devicon-react-original', 'React', '?Months'),
        ]
      ),
      new SkillGroup(
        'Back End',
        [
          new SkillDescription('devicon-ruby-plain', 'Ruby', '?Year'),
          new SkillDescription('devicon-rails-plain', 'Rails', '?Year'),
          new SkillDescription('devicon-nodejs-plain', 'Nodejs', '?Year'),
          new SkillDescription('devicon-express-original', 'Express', '?Months'),
        ]
      ),
      new SkillGroup(
        'Infrastructure',
        [
          new SkillDescription('devicon-amazonwebservices-original', 'AWS', '?Year'),
          new SkillDescription('devicon-google-plain', 'GCP', '?Year'),
          new SkillDescription('devicon-docker-plain', 'DockerSwarm', '?Year'),
          new SkillDescription('devicon-nginx-original', 'Nginx', '?Months'),
        ]
      ),
      new SkillGroup(
        'Data Science',
        [
          new SkillDescription('devicons devicons-python', 'Tensorflow', '?Months'),
          new SkillDescription('devicons devicons-python', 'Python', '?Months'),
          new SkillDescription('devicons devicons-java', 'Hadoop', '?Months'),
          new SkillDescription('devicons devicons-java', 'Java', '?Months'),
        ]
      ),
      new SkillGroup(
        'Project Managing',
        [
          new SkillDescription('devicon-git-plain', 'Git', '?Years'),
        ]
      ),
      new SkillGroup(
        'Testing',
        [
          new SkillDescription('devicon-nodejs-plain', 'Puppeteer', '?Months'),
        ]
      )
    ]
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

export class AdditionalProfileContent {
  title: string;
  largeGroups: Array<LargeGroup>;
  constructor(
    title: string = 'workflow',
    largeGroups: Array<LargeGroup> = [
      new LargeGroup(
        null,
        [
          new SmallGroup(
            'Core Engine',
            [
              new SmallGroupDescription('Run exameple code', 'fa-li fa fa-check'),
              new SmallGroupDescription('Modify interface on exameple code', 'fa-li fa fa-check'),
              new SmallGroupDescription('Integrate Test on Local', 'fa-li fa fa-check'),
              new SmallGroupDescription('System Test on Remote Dev Server', 'fa-li fa fa-check'),
              new SmallGroupDescription('Make Test Server', 'fa-li fa fa-check'),
              new SmallGroupDescription('Make API and Document', 'fa-li fa fa-check'),
            ]
          ),
          new SmallGroup(
            'New Feature',
            [
              new SmallGroupDescription('Make API and Document', 'fa-li fa fa-check'),
              new SmallGroupDescription('Get Requirements', 'fa-li fa fa-check'),
              new SmallGroupDescription('Draw UI Design', 'fa-li fa fa-check'),
              new SmallGroupDescription('Ask Requirement Details', 'fa-li fa fa-check'),
              new SmallGroupDescription('Make UI Design', 'fa-li fa fa-check'),
              new SmallGroupDescription('Design/Migrate Database', 'fa-li fa fa-check'),
              new SmallGroupDescription('Make API with validation', 'fa-li fa fa-check'),
              new SmallGroupDescription('Fix bug on new feature', 'fa-li fa fa-check'),
            ]
          ),
        ],
      )
    ]
  ) {
    this.title = title;
    this.largeGroups = largeGroups;
  }
}

export class LargeGroup {
  largeGroupName: string|null;
  smallGroups: Array<SmallGroup>;
  constructor(
    largeGroupName: string|null = '',
    smallGroups: Array<SmallGroup> = [new SmallGroup()]
  ){
    this.largeGroupName = largeGroupName;
    this.smallGroups = smallGroups;
  }
}

export class SmallGroup {
  smallGroupName: string;
  descriptions: Array<SmallGroupDescription>;
  constructor(
    smallGroupName: string = '',
    descriptions: Array<SmallGroupDescription> = [new SmallGroupDescription()]
  ){
    this.smallGroupName = smallGroupName;
    this.descriptions = descriptions;
  }
}

export class SmallGroupDescription {
  descriptionDetail: string;
  faIcon: string;
  constructor(
    descriptionDetail: string = '',
    faIcon: string = 'fa'
  ){
    this.descriptionDetail = descriptionDetail;
    this.faIcon = faIcon;
  }
}


export class ProfileContent {
  id: string;
  ownerId: string;
  userName: string;
  profileImageSrc: string;
  profileTitle: string;
  aboutContent: AboutContent;
  educationsContent: EducationsContent;
  interestsContent: InterestsContent;
  projectsContent: ProjectsContent;
  skillsContent: SkillsContent;
  additionalProfilesContent: Array<AdditionalProfileContent>;
  slackSyncs: Array<any>;
  updatedFrom: any;
  constructor(
    id: string = '',
    ownerId: string = '',
    userName: string = '',
    profileImageSrc: string = '',
    profileTitle: string = '',
    aboutContent: AboutContent = new AboutContent(),
    educationsContent: EducationsContent = new EducationsContent(),
    interestsContent: InterestsContent = new InterestsContent(),
    projectsContent: ProjectsContent = new ProjectsContent(),
    skillsContent: SkillsContent = new SkillsContent(),
    additionalProfilesContent: Array<AdditionalProfileContent> = [new AdditionalProfileContent()],
    slackSyncs: Array<any> = [],
    updatedFrom: any = {},
  ) {
    this.id = id;
    this.ownerId = ownerId;
    this.userName = userName;
    this.profileImageSrc = profileImageSrc;
    this.profileTitle = profileTitle;
    this.aboutContent = aboutContent;
    this.educationsContent = educationsContent;
    this.interestsContent = interestsContent;
    this.projectsContent = projectsContent;
    this.skillsContent = skillsContent;
    this.additionalProfilesContent = additionalProfilesContent;
    this.slackSyncs = slackSyncs;
    this.updatedFrom = updatedFrom;
  }
}
