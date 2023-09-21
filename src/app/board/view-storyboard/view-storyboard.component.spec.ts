import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStoryboardComponent } from './view-storyboard.component';

describe('ViewStoryboardComponent', () => {
  let component: ViewStoryboardComponent;
  let fixture: ComponentFixture<ViewStoryboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewStoryboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewStoryboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
