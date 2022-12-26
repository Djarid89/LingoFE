import { TestBed } from '@angular/core/testing';

import { LingoService } from './lingo.service';

describe('LingoService', () => {
  let service: LingoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LingoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
