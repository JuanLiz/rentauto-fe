import { TestBed } from '@angular/core/testing';

import { SercatalogounivService } from './sercatalogouniv.service';

describe('SercatalogounivService', () => {
  let service: SercatalogounivService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SercatalogounivService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
