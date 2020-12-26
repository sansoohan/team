import { Component, OnInit } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { TalkContent } from './talk.content';
import { TalkService } from 'src/app/services/talk.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-talk',
  templateUrl: './talk.component.html',
  styleUrls: ['./talk.component.css']
})

export class TalkComponent implements OnInit {
  constructor() {
  }

  ngOnInit(): void {
  }

  OnDestroy() {
  }
}
