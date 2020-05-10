import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-input-add-remove',
  templateUrl: './input-add-remove.component.html',
  styleUrls: ['./input-add-remove.component.css']
})
export class InputAddRemoveComponent implements OnInit {
  @Input() targetArray: Array<any>;
  @Input() targetArrayIndex: number;

  constructor() { }

  ngOnInit(): void {
  }

}
