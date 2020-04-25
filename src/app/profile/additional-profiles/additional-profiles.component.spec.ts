import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalProfilesComponent } from './additional-profiles.component';

describe('AdditionalProfilesComponent', () => {
  let component: AdditionalProfilesComponent;
  let fixture: ComponentFixture<AdditionalProfilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdditionalProfilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalProfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
