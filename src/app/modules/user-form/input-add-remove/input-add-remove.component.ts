import { Component, OnInit, Input } from '@angular/core';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-input-add-remove',
  templateUrl: './input-add-remove.component.html',
  styleUrls: ['./input-add-remove.component.css']
})
export class InputAddRemoveComponent implements OnInit {
  @Input() targetArrayForm: FormArray;
  @Input() targetArrayIndex: number;
  @Input() newObject: any;

  constructor(private fb: FormBuilder) { }

  addInput(){
    this.targetArrayForm.push(this.buildFormRecursively(this.newObject));
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

  removeInput(){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      // tslint:disable-next-line:quotemark
      text: "Remove this data",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.targetArrayForm.removeAt(this.targetArrayIndex);
      }
      else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }

  ngOnInit(): void {
  }
}
