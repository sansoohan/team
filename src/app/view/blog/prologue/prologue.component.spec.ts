import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrologueComponent } from './prologue.component';

describe('PrologueComponent', () => {
  let component: PrologueComponent;
  let fixture: ComponentFixture<PrologueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrologueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrologueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
