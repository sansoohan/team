import { ProfileContent } from './profile.content';

export const profileDefault: ProfileContent = {
  id: 'someId',
  ownerId: 'ownerId',
  profileImageSrc: null,
  profileTitle: 'SanSoo Lab',
  roles: {someUserID: 'owner'},
  skillsContent: {
    skillGroups: [
      {
        skillGroupName: 'Front End',
        skills: [
          {devicon: 'devicons devicons-html5', skillName: 'HTML', term: '2Years'},
          {devicon: 'devicons devicons-css3', skillName: 'CSS', term: '2Years'},
          {devicon: 'devicons devicons-javascript', skillName: 'Javascript', term: '2Years'},
          {devicon: 'devicon-typescript-plain', skillName: 'Typescript', term: '1Year'},
          {devicon: 'devicons devicons-bootstrap', skillName: 'Bootstrap',  term: '1.5Years'},
          {devicon: 'devicon-typescript-plain', skillName: 'Nativescript', term: '6Months'},
          {devicon: 'devicon-angularjs-plain', skillName: 'Angular', term: '1Year'},
          {devicon: 'devicon-vuejs-plain', skillName: 'Vuejs', term: '6Months'},
          {devicon: 'devicon-react-original', skillName: 'React', term: '6Months'}
        ]
      },
      {
        skillGroupName: 'Back End',
        skills: [
          {devicon: 'devicon-ruby-plain', skillName: 'Ruby', term: '1Year'},
          {devicon: 'devicon-rails-plain', skillName: 'Rails', term: '1Year'},
          {devicon: 'devicon-nodejs-plain', skillName: 'Nodejs', term: '1Year'},
          {devicon: 'devicon-express-original', skillName: 'Express', term: '6Months'}
        ]
      },
      {
        skillGroupName: 'Infrastructure',
        skills: [
          {devicon: 'devicon-amazonwebservices-original', skillName: 'AWS',  term: '1.5Year'},
          {devicon: 'devicon-google-plain', skillName: 'GCP', term: '1Year'},
          {devicon: 'devicon-docker-plain', skillName: 'DockerSwarm', term: '1Year'},
          {devicon: 'devicon-nginx-original', skillName: 'Nginx', term: '6Months'}
        ]
      },
      {
        skillGroupName: 'Data Science',
        skills: [
          {devicon: 'devicons devicons-python', skillName: 'Tensorflow', term: '6Months'},
          {devicon: 'devicons devicons-python', skillName: 'Python', term: '6Months'},
          {devicon: 'devicons devicons-java', skillName: 'Hadoop', term: '3Months'},
          {devicon: 'devicons devicons-java', skillName: 'Java', term: '6Months'}
        ]
      },
      {
        skillGroupName: 'Project Managing',
        skills: [
          {devicon: 'devicon-git-plain', skillName: 'Git',  term: '1.5Years'}
        ]
      },
      {
        skillGroupName: 'Testing',
        skills: [
          {devicon: 'devicon-nodejs-plain', skillName: 'Puppeteer', term: '6Months'}
        ]
      }
    ]
  },
  projectsContent: {
    projects: [
      {
        organization: 'Vareal',
        projectName: 'Crawler Maintenace',
        memberNum: 2,
        position: 'PL/PG/SE',
        startedAt: new Date(2019, 4),
        finishedAt: null,
        taskDescriptions: [
          'Maintaining Crawler by chaning crawling algorithm.',
          'Making new crawler engine using proxy and other https libraries'
        ]
      },
      {
        organization: 'Vareal',
        projectName: 'Crawler Refactoring',
        memberNum: 2,
        position: 'PL/PG/SE',
        startedAt: new Date(2019, 4),
        finishedAt: new Date(2020, 1),
        taskDescriptions: [
          'Refactor Infrastructure using docker swarm',
          'Refactor Deploy Flow using docker registry',
          'Admin Page for developer'
        ]
      },
      {
        organization: 'Vareal',
        projectName: 'WebRTC Videochat',
        memberNum: 8,
        position: 'PG/SE',
        startedAt: new Date(2020, 2),
        finishedAt: null,
        taskDescriptions: [
          'Validating user data.',
          'Testing WebRTC SFU Engine.',
          'Fix Bugs for release.'
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
    firstName: 'SanSoo',
    lastName: 'Han',
    address: '2-chōme-16-3 Shiba Minato City, Tōkyō-to 105-0014, Japan',
    phoneNumber: '+81 10-4412-9459',
    email: '2018ndss@gmail.com',
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
        startedAt: new Date(2010, 3),
        finishedAt: new Date(2019, 10)
      },
      {
        organization: 'BulGok High School',
        degree: 'Math/Science',
        descriptions: [],
        startedAt: new Date(2006, 3),
        finishedAt: new Date(2009, 1)
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
