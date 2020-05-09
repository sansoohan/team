import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-monthpicker',
  templateUrl: './monthpicker.component.html',
  styleUrls: ['./monthpicker.component.css']
})
export class MonthpickerComponent implements OnInit {

  @Input() locale: string;
  @Input() date: Date;
  @Input() year: number;
  @Input() month: number;

  @Input() enabledMonths: Array<number> = [];
  @Input() disabledMonths: Array<number> = [];

  @Input() enabledYears: Array<number> = [];
  @Input() disabledYears: Array<number> = [];
  @Input() multiple: boolean; // TODO

  // tslint:disable-next-line:no-output-native
  @Output() change = new EventEmitter<{ monthIndex: number, year: number, date: Date}>();

  model: MonthPickerModel;
  isShowYears: boolean;
  years: Array<number> = [];

  ngOnInit() {
    if (this.locale) {
      moment.locale(this.locale);
    } else {
      moment.locale('en');
    }

    this.model = new MonthPickerModel();

    if (this.date){
      this.year = this.date.getFullYear();
      this.month = this.date.getMonth();
    }

    if (this.year) {
      this.model.selectedYearMoment = moment().year(this.year);
      this.model.updateYearText();
    }

    if (this.month) {
      this.model.selectedMonthIndex = this.month;
      this.model.selectedMonthMoment = moment().month(this.month);
      if (this.year) { this.model.selectedMonthYear = this.year; }
    }

    this.onChange(this.model.selectedMonthIndex, this.model.selectedMonthYear, this.date);
  }

  decrement() {
    this.model.decrementYear();
    this.year--;
    this.date.setFullYear(this.year);
    if (this.isShowYears) {
      this.renderYears();
    }
  }

  increment() {
    this.model.incrementYear();
    this.year++;
    this.date.setFullYear(this.year);
    if (this.isShowYears) {
      this.renderYears();
    }
  }

  selectMonth(index: number) {
    this.model.selectMonth(index);
    this.date.setMonth(index);
    this.onChange(this.model.selectedMonthIndex, this.model.selectedMonthYear, this.date);
  }

  isSelectedMonth(monthIndex: number) {
    return this.model.selectedMonthIndex === monthIndex && this.model.selectedMonthYear === this.model.selectedYearMoment.year();
  }

  onChange(monthIndex: number, year: number, dateout: Date) {
    // tslint:disable-next-line:object-literal-shorthand
    this.change.emit({ monthIndex: monthIndex, year: year, date: dateout });
  }

  isDisabled(index: number) {
    let disabled = false;
    if (this.enabledMonths && this.enabledMonths.length > 0) {
      disabled = this.enabledMonths.indexOf(index) < 0;
    }
    if (this.disabledMonths && this.disabledMonths.length > 0) {
      disabled = this.disabledMonths.indexOf(index) >= 0;
    }
    return disabled;
  }

  toggleShowYears() {
    this.isShowYears = !this.isShowYears;
    this.renderYears();
  }

  renderYears() {
    this.years = [];
    for (let i = 5; i > 0; i--) {
      this.years.push(this.model.selectedYearMoment.year() - i);
    }
    for (let i = 0; i <= 6; i++) {
      this.years.push(this.model.selectedYearMoment.year() + i);
    }
  }

  selectYear(year: number) {
    this.isShowYears = false;
    this.date.setFullYear(year);
    this.model.selectedYearMoment = moment().year(year);
    this.model.updateYearText(); // in set get aendern
  }

  isSelectedYear(year: number){
    return this.model.selectedYearMoment.year() === year;
  }

  isDisabledYear(year: number) {
    // console.warn(year)
    let disabled = false;
    if (this.enabledYears && this.enabledYears.length > 0) {
      disabled = this.enabledYears.findIndex(y => y === year) < 0;
    }
    if (this.disabledYears && this.disabledYears.length > 0) {
      disabled = this.disabledYears.findIndex(y => y === year) >= 0;
    }
    return disabled;
  }
}

export class MonthPickerModel {
  constructor() {
    this.selectedYearMoment = moment();
    this.updateYearText();

    // this.selectedMonthMoment = moment();

    this.months = moment.months();

    // this.selectedMonthIndex = this.selectedMonthMoment.month();
    this.selectedMonthYear = this.selectedYearMoment.year();
  }

  selectedYearMoment: moment.Moment;
  selectedYearText: string;

  selectedMonthMoment: moment.Moment;
  selectedMonthIndex: number;
  selectedMonthYear: number;

  months: Array<string> = [];

  updateYearText() {
    this.selectedYearText = moment(this.selectedYearMoment).format('YYYY');
  }

  selectMonth(index: number) {
    this.selectedMonthMoment = moment().month(index);
    this.selectedMonthIndex = this.selectedMonthMoment.month();
    this.selectedMonthYear = this.selectedYearMoment.year();
  }

  incrementYear() {
    this.selectedYearMoment = this.selectedYearMoment.add(1, 'year');
    this.updateYearText();
  }

  decrementYear() {
    this.selectedYearMoment = this.selectedYearMoment.subtract(1, 'year');
    this.updateYearText();
  }
}
