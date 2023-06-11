import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResizableDragableComponent } from './resizable-dragable.component';

describe('ResizableDragableComponent', () => {
  let component: ResizableDragableComponent;
  let fixture: ComponentFixture<ResizableDragableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResizableDragableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResizableDragableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
