import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup } from '@angular/forms';
import { DataTransferHelper } from 'src/app/helper/data-transefer.helper';
import { RouterHelper } from 'src/app/helper/router.helper';
import { FormHelper } from 'src/app/helper/form.helper';

@Component({
  selector: 'app-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['../blog.component.css', './left-sidebar.component.css']
})
export class LeftSidebarComponent implements OnInit {
  @Input() isEditingPost: boolean;
  @Input() isEditingCategory: boolean;
  @Input() categoryContentsForm: FormGroup;

  constructor(
    public authService: AuthService,
    public dataTransferHelper: DataTransferHelper,
    public routerHelper: RouterHelper,
    public formHelper: FormHelper,
  ) { }

  countChildCategory(categoryId: string) {
    const count = this.categoryContentsForm.controls.categoryContents.value.filter((categoryContent) =>
      categoryContent.parentCategoryId === categoryId && categoryContent.id !== categoryId
    ).length;
    return count;
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
