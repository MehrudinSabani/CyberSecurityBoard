import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResizableImageComponent } from './resizable-image.component';

describe('ResizableImageComponent', () => {
  let component: ResizableImageComponent;
  let fixture: ComponentFixture<ResizableImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResizableImageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResizableImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
