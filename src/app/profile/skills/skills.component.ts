import { Component, OnInit, Input } from '@angular/core';
import { SkillsContent } from './skills.content';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['../profile.component.css', './skills.component.css']
})
export class SkillsComponent implements OnInit {
  @Input() skillsContent: SkillsContent;
  @Input() isEditing: boolean;
  constructor() { }

  ngOnInit() {
  }

}
