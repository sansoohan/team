import { Component, OnInit, Input } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-input-add-remove',
  templateUrl: './input-add-remove.component.html',
  styleUrls: ['./input-add-remove.component.css']
})
export class InputAddRemoveComponent implements OnInit {
  @Input() targetArray: Array<any>;
  @Input() targetArrayIndex: number;
  @Input() newObject: any;

  constructor() { }

  addInput(targetArray: Array<any>){
    targetArray.push(this.newObject);
  }

  removeInput(targetArray: Array<any>, targetArrayIndex: number){
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
        targetArray.splice(targetArrayIndex, 1);
      }
      else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }

  ngOnInit(): void {
  }

}
