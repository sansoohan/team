import { TestBed } from '@angular/core/testing';

import { UploaderHelper } from './uploader.helper';

describe('UploaderHelper', () => {
  let service: UploaderHelper;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UploaderHelper);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
