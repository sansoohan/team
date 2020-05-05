import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RandomAvatarComponent } from './random-avatar.component';

describe('RandomAvatarComponent', () => {
  let component: RandomAvatarComponent;
  let fixture: ComponentFixture<RandomAvatarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RandomAvatarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RandomAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
