import { NgModule } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { RedimWindowsComponent } from './redim-windows.component';
import { FloatingWindowComponent } from './floating-window/floating-window.component';

@NgModule({
  declarations: [
    RedimWindowsComponent,
    FloatingWindowComponent
  ],
  imports: [
    CommonModule,
    DragDropModule,
    OverlayModule,
    PortalModule
  ],
  exports: [
    RedimWindowsComponent,
    FloatingWindowComponent
  ]
})
export class RedimWindowsModule { }
