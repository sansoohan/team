import { Component, OnInit, Input } from '@angular/core';
import { ProjectsContent, ProjectDescription } from './projects.content';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['../profile.component.css', './projects.component.css']
})
export class ProjectsComponent implements OnInit {
  @Input() projectsContent: ProjectsContent;
  @Input() isEditing: boolean;
  public newTaskDescription: '';
  public newProjectDescription: ProjectDescription = new ProjectDescription();

  constructor() { }

  ngOnInit() {
  }

}
