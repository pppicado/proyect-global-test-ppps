import { Component, Inject, Optional, ElementRef, AfterViewInit, OnDestroy, ChangeDetectorRef, Input, ViewChild, AfterViewChecked, ViewContainerRef } from '@angular/core';
import { WINDOW_DATA, FloatingWindowComponent, RedimFrameService } from '@pppicado/redim-frame';
import { Subscription } from 'rxjs';
import { FormComponent } from '../form/form.component';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements AfterViewInit, AfterViewChecked, OnDestroy {
  @Input() data: any;

  public windowWidth: string = '';
  public windowHeight: string = '';
  private sizeSub?: Subscription;

  @ViewChild('windowOrigin', { read: ElementRef }) windowOrigin!: ElementRef;

  constructor(
    @Optional() @Inject(WINDOW_DATA) public injectedData: any,
    @Optional() private floatingWindow: FloatingWindowComponent,
    private el: ElementRef,
    private cdr: ChangeDetectorRef,
    private floatingWindowService: RedimFrameService
  ) { }

  ngAfterViewInit() {
    this.updateDimensions();

    if (this.floatingWindow) {
      this.sizeSub = this.floatingWindow.change.subscribe((event) => {
        if (event.width || event.height) {
          this.updateDimensions();
        }
      });
    }

    this.floatingWindowService.openWindows(FormComponent, {
      width: 40,
      height: 30,
      x: 30,
      y: 20,
      data: { email: 'x@ejemplo.com' },
      origin: this.windowOrigin.nativeElement
    });

    this.windowOrigin
    new ViewContainerRef()
  }

  ngAfterViewChecked() {

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
