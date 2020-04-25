import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent implements OnInit {
  skillsContent: SkillsContent = {
    id: 'someId',
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
  };
  constructor() { }

  ngOnInit() {
  }

}
