import { NgModule } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { RedimFrameComponent } from './redim-frame.component';
import { FloatingWindowComponent } from './floating-window/floating-window.component';
import { VirtualScrollbarModule } from '@pppicado/virtual-scrollbar';

@NgModule({
  declarations: [
    RedimFrameComponent,
    FloatingWindowComponent
  ],
  imports: [
    CommonModule,
    DragDropModule,
    OverlayModule,
    PortalModule,
    VirtualScrollbarModule
  ],
  exports: [
    RedimFrameComponent,
    FloatingWindowComponent,
    VirtualScrollbarModule
  ]
})
export class RedimFrameModule { }
