import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PortalModule } from '@angular/cdk/portal';

import { FloatingWindowComponent } from './floating-window.component';

describe('FloatingWindowComponent', () => {
  let component: FloatingWindowComponent;
  let fixture: ComponentFixture<FloatingWindowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FloatingWindowComponent],
      imports: [DragDropModule, PortalModule]
    });
    fixture = TestBed.createComponent(FloatingWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
