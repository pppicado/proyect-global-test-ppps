import { Component, EventEmitter, HostBinding, Input, Output, Renderer2, OnDestroy, AfterViewInit, OnInit } from '@angular/core';
import { CdkDragEnd, CdkDragStart } from '@angular/cdk/drag-drop';
import { Portal } from '@angular/cdk/portal';

@Component({
  selector: 'lib-floating-window',
  templateUrl: './floating-window.component.html',
  styleUrls: ['./floating-window.component.css']
})
export class FloatingWindowComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() width: number = 30; // Default 30vw
  @Input() height: number = 30; // Default 30vh
  @Input() x: number = 10; // Default 10vw
  @Input() y: number = 10; // Default 10vh
  @Input() zIndex: number = 1000;
  @Input() contentPortal: Portal<any> | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() focus = new EventEmitter<void>();
  @Output() sizeChange = new EventEmitter<{ width: number, height: number }>();

  @Input() resizeBorder: number = 0.5; // Default 0.5vw
  @Input() minWidth: number = 10; // Default 10vw
  @Input() minHeight: number = 10; // Default 10vh

  @Input() scrollIcon: string = ''; // 'https://png.pngtree.com/png-clipart/20250116/original/pngtree-beautiful-amber-stone-featuring-unique-translucent-textures-png-image_20234893.png'
  @Input() scrollThumbSize: number = 2; // Default 2vw

  @HostBinding('style.--resizeBorder') resizeBorderStyle: string = this.resizeBorder + 'vw';

  @HostBinding('style.--width') get widthStyle() { return this.width + 'vw'; }
  @HostBinding('style.--height') get heightStyle() { return this.height + 'vh'; }
  @HostBinding('style.--left') get leftStyle() { return this.x + 'vw'; }
  @HostBinding('style.--top') get topStyle() { return this.y + 'vh'; }
  @HostBinding('style.--z-index') get zIndexStyle() { return this.zIndex; }

  get dragPositionPixels() {
    return {
      x: (this.x * window.innerWidth) / 100,
      y: (this.y * window.innerHeight) / 100
    };
  }

  private isResizing: boolean = false;
  private resizeDirection: string = '';
  private startX: number = 0;
  private startY: number = 0;
  private startWidth: number = 0;
  private startHeight: number = 0;
  private startXWindow: number = 0;
  private startYWindow: number = 0;

  private mouseMoveListener: Function | null = null;
  private mouseUpListener: Function | null = null;

  constructor(private renderer: Renderer2) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    this.removeResizeListeners();
  }

  onDragStart(event: CdkDragStart) {
    this.focus.emit();
  }

  onDragEnd(event: CdkDragEnd) {
    const element = event.source.getRootElement();
    const rect = element.getBoundingClientRect();
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;
    this.x = ((rect.left + scrollX) / window.innerWidth) * 100;
    this.y = ((rect.top + scrollY) / window.innerHeight) * 100;
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
    event.stopPropagation();

    this.isResizing = true;
    this.resizeDirection = direction;
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.startWidth = this.width;
    this.startHeight = this.height;
    this.startXWindow = this.x;
    this.startYWindow = this.y;

    this.focus.emit();

    this.mouseMoveListener = this.renderer.listen('document', 'mousemove', (e) => this.onResize(e));
    this.mouseUpListener = this.renderer.listen('document', 'mouseup', () => this.stopResize());
  }

  onResize(event: MouseEvent) {
    if (!this.isResizing) return;
    const dxPx = event.clientX - this.startX;
    const dyPx = event.clientY - this.startY;
    const dxVw = (dxPx / window.innerWidth) * 100;
    const dyVh = (dyPx / window.innerHeight) * 100;

    for (const direction of this.resizeDirection) {
      switch (direction) {
        case 'e':
          this.width = Math.max(10, this.startWidth + dxVw);
          break;
        case 'w':
          this.width = Math.max(10, this.startWidth - dxVw);
          this.x = this.startXWindow + (this.startWidth - this.width);
          break;
        case 's':
          this.height = Math.max(this.minHeight, this.startHeight + dyVh);
          break;
        case 'n':
          this.height = Math.max(this.minHeight, this.startHeight - dyVh);
          this.y = this.startYWindow + (this.startHeight - this.height);
          break;
      }
    }
    this.sizeChange.emit({ width: this.width, height: this.height });
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
