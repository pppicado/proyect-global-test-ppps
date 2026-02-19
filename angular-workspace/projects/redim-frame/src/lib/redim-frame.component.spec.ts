import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedimFrameComponent } from './redim-frame.component';

describe('RedimFrameComponent', () => {
  let component: RedimFrameComponent;
  let fixture: ComponentFixture<RedimFrameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RedimFrameComponent]
    });
    fixture = TestBed.createComponent(RedimFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
