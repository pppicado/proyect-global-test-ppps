import { NgModule } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { FloatingWindowComponent } from './floating-window/floating-window.component';
import { VirtualScrollbarModule } from '@pppicado/virtual-scrollbar';

@NgModule({
  declarations: [
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
    FloatingWindowComponent,
    VirtualScrollbarModule
  ]
})
export class RedimFrameModule { }
