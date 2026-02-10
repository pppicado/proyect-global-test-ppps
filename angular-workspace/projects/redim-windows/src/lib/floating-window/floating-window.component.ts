import { Component, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2, ViewChild, OnDestroy, AfterViewInit, OnInit } from '@angular/core';
import { CdkDragEnd, CdkDragStart } from '@angular/cdk/drag-drop';
import { Portal } from '@angular/cdk/portal';

@Component({
  selector: 'lib-floating-window',
  templateUrl: './floating-window.component.html',
  styleUrls: ['./floating-window.component.css']
})
export class FloatingWindowComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() title: string = 'Window';
  @Input() width: number = 400;
  @Input() height: number = 300;
  @Input() x: number = 100;
  @Input() y: number = 100;
  @Input() zIndex: number = 1000;
  @Input() contentPortal: Portal<any> | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() focus = new EventEmitter<void>();
  @Output() sizeChange = new EventEmitter<{width: number, height: number}>();

  // Position object for cdkDrag
  dragPosition = {x: 0, y: 0};

  private isResizing: boolean = false;
  private resizeDirection: string = '';
  private startX: number = 0;
  private startY: number = 0;
  private startWidth: number = 0;
  private startHeight: number = 0;

  private mouseMoveListener: Function | null = null;
  private mouseUpListener: Function | null = null;

  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    this.dragPosition = {x: this.x, y: this.y};
  }

  ngAfterViewInit() {
    // Initial size is set via bindings
  }

  ngOnDestroy() {
    this.removeResizeListeners();
  }

  onDragStart(event: CdkDragStart) {
    this.focus.emit();
  }

  onDragEnd(event: CdkDragEnd) {
    const element = event.source.getRootElement();
    const transform = element.style.transform;
    this.dragPosition = event.source.getFreeDragPosition();
    this.x = this.dragPosition.x;
    this.y = this.dragPosition.y;
  }

  onWindowClick() {
    this.focus.emit();
  }

  closeWindow() {
    this.close.emit();
  }

  // Resizing logic
  initResize(event: MouseEvent, direction: string) {
    event.preventDefault();
    event.stopPropagation(); // Prevent drag start

    this.isResizing = true;
    this.resizeDirection = direction;
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.startWidth = this.width;
    this.startHeight = this.height;

    this.focus.emit();

    // Add global event listeners
    this.mouseMoveListener = this.renderer.listen('document', 'mousemove', (e) => this.onResize(e));
    this.mouseUpListener = this.renderer.listen('document', 'mouseup', () => this.stopResize());
  }

  onResize(event: MouseEvent) {
    if (!this.isResizing) return;

    const dx = event.clientX - this.startX;
    const dy = event.clientY - this.startY;

    if (this.resizeDirection === 'e') {
      this.width = Math.max(200, this.startWidth + dx);
    } else if (this.resizeDirection === 's') {
      this.height = Math.max(150, this.startHeight + dy);
    } else if (this.resizeDirection === 'se') {
      this.width = Math.max(200, this.startWidth + dx);
      this.height = Math.max(150, this.startHeight + dy);
    }

    this.sizeChange.emit({width: this.width, height: this.height});
  }

  stopResize() {
    this.isResizing = false;
    this.removeResizeListeners();
  }

  private removeResizeListeners() {
    if (this.mouseMoveListener) {
      this.mouseMoveListener();
      this.mouseMoveListener = null;
    }
    if (this.mouseUpListener) {
      this.mouseUpListener();
      this.mouseUpListener = null;
    }
  }
}
