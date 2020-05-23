import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmbededGooglemapComponent } from './embeded-googlemap.component';

describe('EmbededGooglemapComponent', () => {
  let component: EmbededGooglemapComponent;
  let fixture: ComponentFixture<EmbededGooglemapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmbededGooglemapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmbededGooglemapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
