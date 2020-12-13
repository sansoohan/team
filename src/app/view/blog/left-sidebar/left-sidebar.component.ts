import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup } from '@angular/forms';
import { DataTransferHelper } from 'src/app/helper/data-transefer.helper';
import { RouterHelper } from 'src/app/helper/router.helper';
import { FormHelper } from 'src/app/helper/form.helper';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from 'src/app/services/blog.service';

@Component({
  selector: 'app-blog-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['../blog.component.css', './left-sidebar.component.css']
})
export class LeftSidebarComponent implements OnInit {
  @Input() isEditingPost: boolean;
  @Input() isEditingCategory: boolean;
  @Input() categoryContentsForm: FormGroup;

  paramSub: Subscription;
  params: any;
  isPage: boolean;

  constructor(
    private route: ActivatedRoute,
    public authService: AuthService,
    public blogService: BlogService,
    public dataTransferHelper: DataTransferHelper,
    public routerHelper: RouterHelper,
    public formHelper: FormHelper,
  ) {
    this.paramSub = this.route.params.subscribe(params => {
      this.isPage = true;
      this.params = params;
    });
  }

  clickCategoryEdit() {
    this.isEditingCategory = true;
  }

  clickCategoryEditCancel(){
    this.isEditingCategory = false;
  }

  ngOnInit(): void {
  }
}
