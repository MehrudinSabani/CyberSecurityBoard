import { TestBed } from '@angular/core/testing';

import { ContainerStorageService } from './container-storage.service';

describe('ContainerStorageService', () => {
  let service: ContainerStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContainerStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
