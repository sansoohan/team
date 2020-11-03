import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-monthpicker',
  templateUrl: './monthpicker.component.html',
  styleUrls: ['./monthpicker.component.css']
})
export class MonthpickerComponent implements OnInit {
  @Input() control: FormControl;

  constructor(){

  }
  ngOnInit(){

  }
}
