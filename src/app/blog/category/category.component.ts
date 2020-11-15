import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['../blog.component.css', './category.component.css']
})
export class AboutComponent implements OnInit {
  @Input() isEditing: boolean;
  @Input() profileForm: any;

  constructor() { }

  ngOnInit() {
  }
}
