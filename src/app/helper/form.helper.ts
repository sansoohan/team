import { Injectable } from '@angular/core';
import { FormBuilder, FormArray, AbstractControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormHelper {
  constructor(
    private fb: FormBuilder,
  ) { }

  buildFormRecursively(profileContent: any): AbstractControl{
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

  getChildCategoriesRecusively(
    allCategory: Array<FormGroup>,
    parentCategory: FormGroup
  ): Array<FormGroup>{
    const childCategories = allCategory
    .filter((categoryForm) => categoryForm.value.parentCategoryId === parentCategory.value.id);
    if (childCategories.length === 0){
      return [];
    }

    let returnCategories = [...childCategories];
    for (const childCategory of childCategories){
      returnCategories = [
        ...returnCategories,
        ...this.getChildCategoriesRecusively(allCategory, childCategory)
      ];
    }
    return returnCategories;
  }

  toggleCategoryCollapsed(allCategory: Array<FormGroup>, category: FormGroup){
    const collapsed = !category.controls.collapsed.value;
    category.controls.collapsed.setValue(collapsed);
    let childCategories = [];
    if (!collapsed){
      childCategories = allCategory
      .filter((categoryForm) => categoryForm.value.parentCategoryId === category.value.id);
    } else {
      childCategories = this.getChildCategoriesRecusively(allCategory, category);
    }
    childCategories.forEach((childCategory) => {
      childCategory.controls.hidden.setValue(collapsed);
      childCategory.controls.collapsed.setValue(!collapsed);
    });
  }
}
