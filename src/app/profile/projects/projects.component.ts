import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['../profile.component.css', './projects.component.css']
})
export class ProjectsComponent implements OnInit {
  @Input() projectsContent: ProjectsContent;
  @Input() isEditing: boolean;

  constructor() { }

  ngOnInit() {
  }

}
