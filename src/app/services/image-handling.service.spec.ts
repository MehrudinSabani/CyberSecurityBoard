import { TestBed } from '@angular/core/testing';

import { ImageHandlingService } from './image-handling.service';

describe('ImageHandlingService', () => {
  let service: ImageHandlingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageHandlingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
