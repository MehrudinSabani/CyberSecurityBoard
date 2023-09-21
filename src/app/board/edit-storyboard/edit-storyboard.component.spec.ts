import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStoryboardComponent } from './edit-storyboard.component';

describe('EditStoryboardComponent', () => {
  let component: EditStoryboardComponent;
  let fixture: ComponentFixture<EditStoryboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditStoryboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditStoryboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
