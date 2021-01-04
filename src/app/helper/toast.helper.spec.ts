import { TestBed } from '@angular/core/testing';

import { ToastHelper } from './toast.helper';

describe('ToastHelper', () => {
  let service: ToastHelper;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastHelper);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
