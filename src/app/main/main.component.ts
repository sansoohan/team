import { Component, OnInit } from '@angular/core';
import { WOW } from 'wowjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor() {
    new WOW().init({
      boxClass: 'wow',
      animateClass: 'animated',
      offset: 0,
      live: true
    });
  }

  ngOnInit(): void {
  }

}
