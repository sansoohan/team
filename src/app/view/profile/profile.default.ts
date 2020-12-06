import { ProfileContent } from './profile.content';

export const profileDefault: ProfileContent = {
  id: '',
  ownerId: '',
  profileImageSrc: '',
  profileTitle: '',
  roles: {},
  skillsContent: {
    skillGroups: [
      {
        skillGroupName: 'Front End',
        skills: [
          {devicon: 'devicons devicons-html5', skillName: 'HTML', term: '?Years'},
          {devicon: 'devicons devicons-css3', skillName: 'CSS', term: '?Years'},
          {devicon: 'devicons devicons-javascript', skillName: 'Javascript', term: '?Years'},
          {devicon: 'devicon-typescript-plain', skillName: 'Typescript', term: '?Year'},
          {devicon: 'devicons devicons-bootstrap', skillName: 'Bootstrap',  term: '?Years'},
          {devicon: 'devicon-typescript-plain', skillName: 'Nativescript', term: '?Months'},
          {devicon: 'devicon-angularjs-plain', skillName: 'Angular', term: '?Year'},
          {devicon: 'devicon-vuejs-plain', skillName: 'Vuejs', term: '?Months'},
          {devicon: 'devicon-react-original', skillName: 'React', term: '?Months'}
        ]
      },
      {
        skillGroupName: 'Back End',
        skills: [
          {devicon: 'devicon-ruby-plain', skillName: 'Ruby', term: '?Year'},
          {devicon: 'devicon-rails-plain', skillName: 'Rails', term: '?Year'},
          {devicon: 'devicon-nodejs-plain', skillName: 'Nodejs', term: '?Year'},
          {devicon: 'devicon-express-original', skillName: 'Express', term: '?Months'}
        ]
      },
      {
        skillGroupName: 'Infrastructure',
        skills: [
          {devicon: 'devicon-amazonwebservices-original', skillName: 'AWS',  term: '?Year'},
          {devicon: 'devicon-google-plain', skillName: 'GCP', term: '?Year'},
          {devicon: 'devicon-docker-plain', skillName: 'DockerSwarm', term: '?Year'},
          {devicon: 'devicon-nginx-original', skillName: 'Nginx', term: '?Months'}
        ]
      },
      {
        skillGroupName: 'Data Science',
        skills: [
          {devicon: 'devicons devicons-python', skillName: 'Tensorflow', term: '?Months'},
          {devicon: 'devicons devicons-python', skillName: 'Python', term: '?Months'},
          {devicon: 'devicons devicons-java', skillName: 'Hadoop', term: '?Months'},
          {devicon: 'devicons devicons-java', skillName: 'Java', term: '?Months'}
        ]
      },
      {
        skillGroupName: 'Project Managing',
        skills: [
          {devicon: 'devicon-git-plain', skillName: 'Git',  term: '?Years'}
        ]
      },
      {
        skillGroupName: 'Testing',
        skills: [
          {devicon: 'devicon-nodejs-plain', skillName: 'Puppeteer', term: '?Months'}
        ]
      }
    ]
  },
  projectsContent: {
    projects: [
      {
        organization: 'Company',
        projectName: 'ProjectName',
        memberNum: 2,
        position: 'PM/PL/PG/SE/QA',
        startedAt: null,
        finishedAt: null,
        taskDescriptions: [
          'Task Flow 1',
          'Task Flow 2'
        ]
      }
    ]
  },
  interestsContent: {
    descriptions: [
      'Hadoop Distribute System',
      'Hacking technique for developer',
      'Bio Sensor for Input Device',
      'AI Programing'
    ]
  },
  aboutContent: {
    firstName: 'First Name',
    lastName: 'Last Name',
    userName: null,
    address: 'Address',
    phoneNumber: '+00 00-0000-0000',
    email: 'your-email@gmail.com',
    social: [
      {
        socialUrl: 'https://kr.linkedin.com/in/sansoo-han-29a40216a',
        faIcon: 'fa fa-linkedin'
      },
      {
        socialUrl: 'https://github.com/sansoohan',
        faIcon: 'fa fa-github'
      }
    ]
  },
  educationsContent: {
    educations: [
      {
        organization: 'University of Dankook',
        degree: 'Bachelor of Computer Science',
        descriptions: ['Software Enginneering', 'GPA: 3.02'],
        startedAt: null,
        finishedAt: null
      },
      {
        organization: 'BulGok High School',
        degree: 'Math/Science',
        descriptions: [],
        startedAt: null,
        finishedAt: null
      }
    ]
  },
  additaionProfilesContent: [
    {
      title: 'workflow',
      largeGroups: [
        {
          largeGroupName: null,
          smallGroups: [
            {
              smallGroupName: 'Core Engine',
              descriptions: [
                {descriptionDetail: 'Run exameple code', faIcon: 'fa-li fa fa-check'},
                {descriptionDetail: 'Modify interface on exameple code', faIcon: 'fa-li fa fa-check'},
                {descriptionDetail: 'Integrate Test on Local', faIcon: 'fa-li fa fa-check'},
                {descriptionDetail: 'System Test on Remote Dev Server', faIcon: 'fa-li fa fa-check'},
                {descriptionDetail: 'Make Test Server', faIcon: 'fa-li fa fa-check'},
                {descriptionDetail: 'Make API and Document', faIcon: 'fa-li fa fa-check'}
              ]
            },
            {
              smallGroupName: 'New Feature',
              descriptions: [
                {descriptionDetail: 'Make API and Document', faIcon: 'fa-li fa fa-check'},
                {descriptionDetail: 'Get Requirements', faIcon: 'fa-li fa fa-check'},
                {descriptionDetail: 'Draw UI Design', faIcon: 'fa-li fa fa-check'},
                {descriptionDetail: 'Ask Requirement Details', faIcon: 'fa-li fa fa-check'},
                {descriptionDetail: 'Make UI Design', faIcon: 'fa-li fa fa-check'},
                {descriptionDetail: 'Design/Migrate Database', faIcon: 'fa-li fa fa-check'},
                {descriptionDetail: 'Make API with validation', faIcon: 'fa-li fa fa-check'},
                {descriptionDetail: 'Fix bug on new feature', faIcon: 'fa-li fa fa-check'},
              ]
            }
          ]
        }
      ]
    }
  ]
};
