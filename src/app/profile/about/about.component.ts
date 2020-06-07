import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AboutContent, AboutSocial } from './about.content';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['../profile.component.css', './about.component.css']
})
export class AboutComponent implements OnInit {
  @Input() aboutContent: AboutContent;
  @Input() isEditing: boolean;
  @Output() userEmailOutput = new EventEmitter<string>();
  @Output() userNameOutput = new EventEmitter<string>();

  public newAboutSocial: AboutSocial = new AboutSocial();

  constructor() {

  }

  onUserEmailChange(event){
    this.userEmailOutput.emit(event.target.value);
  }

  onUserNameChange(event){
    this.userNameOutput.emit(event.target.value);
  }

  ngOnInit() {
  }

}
