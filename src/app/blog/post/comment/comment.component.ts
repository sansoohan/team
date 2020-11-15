import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['../../blog.component.css', './comment.component.css']
})
export class CommentComponent implements OnInit {
  @Input() isEditing: boolean;
  @Input() profileForm: any;

  constructor() { }

  ngOnInit() {
  }
}
