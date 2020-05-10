import { Component, OnInit, Input } from '@angular/core';
import { AboutContent } from './about.content';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['../profile.component.css', './about.component.css']
})
export class AboutComponent implements OnInit {
  @Input() aboutContent: AboutContent;
  @Input() isEditing: boolean;

  constructor() {

  }

  ngOnInit() {
  }

}
