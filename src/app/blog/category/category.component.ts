import { Component, OnInit, Input, Pipe, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, FormArray, FormBuilder } from '@angular/forms';

import * as moment from 'moment';
import { PostContent } from '../post/post.content';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BlogService } from 'src/app/services/blog.service';
import { BlogContent } from '../blog.content';
import Swal from 'sweetalert2';
import { CategoryContent } from '../category/category.content';
import { AuthService } from 'src/app/services/auth.service';
// import 'moment/locale/de';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['../blog.component.css', './category.component.css']
})
export class CategoryComponent implements OnInit {
  @Output() goToPost: EventEmitter<string> = new EventEmitter();
  @Output() goToCategory: EventEmitter<string> = new EventEmitter();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private blogService: BlogService,
    public authService: AuthService,
  ) {
  }

  ngOnInit() {

  }
}
