import { TestBed } from '@angular/core/testing';

import { DataTransferHelper } from './data-transefer.helper';

describe('DataTransferHelper', () => {
  let service: DataTransferHelper;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataTransferHelper);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
