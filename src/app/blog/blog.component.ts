import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  isPage: boolean;
  isEditing: boolean;
  content = "```javascript\n"
    + "const functions(){}\n"
    + "const functions(){}\n"
    + "const functions(){}\n"
    + "const functions(){}\n"
    + "```"

  constructor() { 
    this.isPage = true;
    this.isEditing = false;
  }

  ngOnInit(): void {
  }

}
