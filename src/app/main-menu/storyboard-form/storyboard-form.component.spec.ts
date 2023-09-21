import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoryboardFormComponent } from './storyboard-form.component';

describe('StoryboardFormComponent', () => {
  let component: StoryboardFormComponent;
  let fixture: ComponentFixture<StoryboardFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoryboardFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoryboardFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
