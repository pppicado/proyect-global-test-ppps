import { Component, Inject, Optional, ElementRef, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { WINDOW_DATA } from '@pppicado/redim-frame';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements AfterViewInit, OnDestroy {
  public windowWidth: string = '';
  public windowHeight: string = '';
  private mutationObserver: MutationObserver | null = null;

  constructor(
    @Optional() @Inject(WINDOW_DATA) public data: any,
    private el: ElementRef,
    private cdr: ChangeDetectorRef
  ) { }

  ngAfterViewInit() {
    this.updateDimensions();

    this.updateDimensions();

    this.mutationObserver = new MutationObserver(() => {
      this.updateDimensions();
    });

    const hostElement = this.el.nativeElement.closest('.window-container');
    if (hostElement) {
      this.mutationObserver.observe(hostElement, { attributes: true, attributeFilter: ['style'] });
    }
  }

  ngOnDestroy() {
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
  }

  private updateDimensions() {
    const computedStyle = getComputedStyle(this.el.nativeElement);
    this.windowWidth = computedStyle.getPropertyValue('--window-width').trim();
    this.windowHeight = computedStyle.getPropertyValue('--window-height').trim();
    this.cdr.detectChanges();
  }
}
