import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedimWindowsComponent } from './redim-windows.component';

describe('RedimWindowsComponent', () => {
  let component: RedimWindowsComponent;
  let fixture: ComponentFixture<RedimWindowsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RedimWindowsComponent]
    });
    fixture = TestBed.createComponent(RedimWindowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
