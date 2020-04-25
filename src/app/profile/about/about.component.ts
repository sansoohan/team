import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  aboutContent: AboutContent = {
    id: 'someId',
    firstName: 'SanSoo',
    lastName: 'Han',
    address: '2-chōme-16-3 Shiba Minato City, Tōkyō-to 105-0014, Japan',
    phoneNumber: '+81 10-4412-9459',
    email: '2018ndss@gmail.com',
    social: [
      {
        socialUrl: 'https://kr.linkedin.com/in/sansoo-han-29a40216a',
        faIcon: 'fa fa-linkedin'
      },
      {
        socialUrl: 'https://github.com/sansoohan',
        faIcon: 'fa fa-github'
      }
    ]
  };
  constructor() { }

  ngOnInit() {
  }

}
