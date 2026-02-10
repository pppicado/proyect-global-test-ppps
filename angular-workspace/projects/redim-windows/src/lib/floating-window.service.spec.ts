import { TestBed } from '@angular/core/testing';
import { FloatingWindowService } from './floating-window.service';
import { OverlayModule } from '@angular/cdk/overlay';

describe('FloatingWindowService', () => {
  let service: FloatingWindowService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OverlayModule],
      providers: [FloatingWindowService]
    });
    service = TestBed.inject(FloatingWindowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
