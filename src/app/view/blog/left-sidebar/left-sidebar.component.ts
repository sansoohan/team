import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormArray, Form } from '@angular/forms';
import { DataTransferHelper } from 'src/app/helper/data-transefer.helper';
import { RouterHelper } from 'src/app/helper/router.helper';
import { FormHelper } from 'src/app/helper/form.helper';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from 'src/app/services/blog.service';
import { BlogContent } from '../blog.content';
import { CategoryContent } from '../category/category.content';
import { ToastHelper } from 'src/app/helper/toast.helper';

@Component({
  selector: 'app-blog-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['../blog.component.css', './left-sidebar.component.css']
})
export class LeftSidebarComponent implements OnInit {
  @Input() isEditingPost: boolean;
  @Input() isEditingCategory: boolean;
  @Input() categoryContentsForm: FormGroup;
  @Input() categoryContents: Array<CategoryContent>;
  @Input() blogContents: Array<BlogContent>;

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
    private toastHelper: ToastHelper,
  ) {
    this.paramSub = this.route.params.subscribe(params => {
      this.isPage = true;
      this.params = params;
    });
  }

  switchCategory(
    categoryContentGroupA: FormGroup,
    categoryContentGroupB: FormGroup,
    categoryContentsArray: FormArray,
  ): void {
    console.log(categoryContentGroupA, categoryContentGroupB)
    if(!categoryContentGroupA) {
      return
    }
    else if(!categoryContentGroupB){
      categoryContentGroupA.controls.parentId.setValue(null)
    }
    else if(categoryContentGroupB.value.parentId === categoryContentGroupA.value.id) {
      const tmpCategoryANubmer = categoryContentGroupA.value.categoryNumber
      console.log(tmpCategoryANubmer)
      categoryContentGroupA.controls.categoryNumber.setValue(categoryContentGroupB.value.categoryNumber)
      categoryContentGroupB.controls.categoryNumber.setValue(tmpCategoryANubmer)
      categoryContentGroupB.controls.parentId.setValue(categoryContentGroupA.value.parentId || null)
    } else if (
      categoryContentGroupB.value.parentId === categoryContentGroupA.value.parentId &&
      categoryContentGroupA.value.parentId
    ) {
      categoryContentGroupB.controls.parentId.setValue(categoryContentGroupA.value.id)
    } else {
      categoryContentGroupB.controls.parentId.setValue(categoryContentGroupA.value.parentId)
    }

    const categoryContentsArraySorted =
    categoryContentsArray.value.sort((categoryA: CategoryContent, categoryB: CategoryContent) =>
    categoryA.categoryNumber - categoryB.categoryNumber);
    categoryContentsArray.patchValue(categoryContentsArraySorted);
  }

  clickCategoryEdit(): void {
    this.isEditingCategory = true;
  }

  clickCategoryEditCancel(): void {
    this.isEditingCategory = false;
  }

  async clickCategoryEditUpdate(
    blogContents: Array<BlogContent>,
    categoryContents: Array<CategoryContent>,
    categoryContentsArray: FormArray,
  ) {
    console.log(blogContents)
    console.log(categoryContentsArray.value.map((categoryContent) => categoryContent.categoryNumber))
    blogContents[0].categoryOrder = categoryContentsArray.value.map((categoryContent) => categoryContent.id)
    let categoryContentPromises = [
      this.blogService.update(
        `blogs/${blogContents[0].id}`,
        blogContents[0]
      )
    ]

    categoryContentPromises = [
      ...categoryContentPromises,
      ...categoryContents.map((categoryContent) => {
        const categoryMightBeChanged = categoryContentsArray.value
        .find((category) => category.id === categoryContent.id)

        if(
          categoryMightBeChanged.parentId !== categoryContent.parentId ||
          categoryMightBeChanged.categoryTitle !== categoryContent.categoryTitle ||
          categoryMightBeChanged.hidden !== categoryContent.hidden ||
          categoryMightBeChanged.collapsed !== categoryContent.collapsed
        ) {
          return this.blogService.update(
            `blogs/${blogContents[0].id}/categories/${categoryContent.id}`,
            categoryContentsArray.value.map((categoryContent) => categoryContent.categoryNum)
          )
        }
        else {
          return new Promise<void>((resolve) => {resolve()})
        }
      })
    ]

    await Promise.all(categoryContentPromises)
    .then(() => {
      this.toastHelper.showSuccess('Category Update', 'Success!');
    })
    .catch(e => {
      this.toastHelper.showWarning('Category Update Failed.', e);
    });
  }

  ngOnInit(): void {
  }
}
