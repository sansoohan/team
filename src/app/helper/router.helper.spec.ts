import { TestBed } from '@angular/core/testing';

import { RouterHelper } from './router.helper';

describe('RouterHelper', () => {
  let service: RouterHelper;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RouterHelper);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
