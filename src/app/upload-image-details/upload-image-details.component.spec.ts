import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadImageDetailsComponent } from './upload-image-details.component';

describe('UploadImageDetailsComponent', () => {
  let component: UploadImageDetailsComponent;
  let fixture: ComponentFixture<UploadImageDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadImageDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadImageDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
