import { Component, Inject, Optional, ElementRef, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { WINDOW_DATA, FloatingWindowComponent } from '@pppicado/redim-frame';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements AfterViewInit, OnDestroy {
  public windowWidth: string = '';
  public windowHeight: string = '';
  private sizeSub?: Subscription;

  constructor(
    @Optional() @Inject(WINDOW_DATA) public data: any,
    @Optional() private floatingWindow: FloatingWindowComponent,
    private el: ElementRef,
    private cdr: ChangeDetectorRef
  ) { }

  ngAfterViewInit() {
    this.updateDimensions();

    if (this.floatingWindow) {
      this.sizeSub = this.floatingWindow.sizeChange.subscribe(() => {
        this.updateDimensions();
      });
    }
  }

  ngOnDestroy() {
    if (this.sizeSub) {
      this.sizeSub.unsubscribe();
    }
  }

  private updateDimensions() {
    const hostElement = this.el.nativeElement.closest('.window-container') as HTMLElement;
    if (hostElement) {
      const newWidth = hostElement.style.getPropertyValue('--window-width').trim();
      const newHeight = hostElement.style.getPropertyValue('--window-height').trim();

      if (this.windowWidth !== newWidth || this.windowHeight !== newHeight) {
        this.windowWidth = newWidth;
        this.windowHeight = newHeight;
        this.cdr.detectChanges();
      }
    }
  }
}
