import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, FormArray, FormBuilder } from '@angular/forms';

import * as moment from 'moment';
import { PostContent } from './post.content';
// import 'moment/locale/de';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['../blog.component.css', './post.component.css']
})
export class PostComponent implements OnInit {
  @Input() isEditing: boolean;
  public newDescription: '';
  public postForm: any;

  newPostConent = new PostContent();

  selectedYearAsText: string;
  selectedMonthIndex: number;
  selectedMonthAsText: string;

  constructor(
    private fb: FormBuilder,
  ) {
    this.newPostConent.postTitle = "Awsome";
    this.newPostConent.postMarkdown = "```javascript\n"
    + ":heart:\n"
    + "const functions(){}\n"
    + "const functions(){}\n"
    + "const functions(){}\n"
    + "const functions(){}\n"
    + "const functions(){}\n"
    + "const functions(){}\n"
    + "const functions(){}\n"
    + "const functions(){}\n"
    + "const functions(){}\n"
    + "const functions(){}\n"
    + "const functions(){}\n"
    + "const functions(){}\n"
    + "const functions(){}\n"
    + "const functions(){}\n"
    + "const functions(){}\n"
    + "const functions(){}\n"
    + "const functions(){}\n"
    + "const functions(){}\n"
    + "const functions(){}\n"
    + "const functions(){}\n"
    + "const functions(){}\n"
    + "const functions(){}\n"
    + "const functions(){}\n"
    + "const functions(){}\n"
    + "const functions(){}\n"
    + "const functions(){}\n"
    + "const functions(){}\n"
    + "const functions(){}\n"
    + "const functions(){}\n"
    + "const functions(){}\n"
    + "const functions(){}\n"
    + "const functions(){}\n"
    + "const functions(){}\n"
    + "const functions(){}\n"
    + "const functions(){}\n"
    + "const functions(){}\n"
    + "const functions(){}\n"
    + "const functions(){}\n"
    + "const functions(){}\n"
    + "const functions(){}\n"
    + "const functions(){}\n"
    + "const functions(){}\n"
    + "const functions(){}\n"
    + "const functions(){}\n"
    + "const functions(){}\n"
    + "const functions(){}\n"
    + "const functions(){}\n"
    + "const functions(){}\n"
    + "const functions(){}\n"
    + "const functions(){}\n"
    + "const functions(){}\n"
    + "const functions(){}\n"
    + "const functions(){}\n"
    + "const functions(){}\n"
    + "const functions(){}\n"
    + "const functions(){}\n"
    + "```"

    this.postForm = this.buildFormRecursively(this.newPostConent);
  }

  getPostMarkdownLines(){
    return this.postForm?.controls?.postMarkdown?.value?.match(/\n/g).length + 2 || 3;
  }

  buildFormRecursively(profileContent: any){
    if (profileContent instanceof Date) {
      return this.fb.control(new Date(profileContent).toISOString().slice(0, -1));
    }
    else if (profileContent instanceof Array){
      const retArray: FormArray = this.fb.array([]);
      for (const el of profileContent){
        retArray.push(this.buildFormRecursively(el));
      }
      return retArray;
    }
    else if (profileContent instanceof Object) {
      const retHash: FormGroup = this.fb.group({});
      for (const key in profileContent){
        if (key){
          retHash.addControl(key, this.buildFormRecursively(profileContent[key]));
        }
      }
      return retHash;
    }
    else {
      return this.fb.control(profileContent);
    }
  }

  ngOnInit() {

  }

  onChange(event) {
    // console.log(event);
    // console.warn(this.selectedYearAsText, this.selectedMonthAsText, `(month index: ${this.selectedMonthIndex})`)
  }
}
