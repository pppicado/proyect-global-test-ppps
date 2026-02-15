import { NgModule } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { CustomScrollbarComponent } from './custom-scrollbar.component';

@NgModule({
  declarations: [
    CustomScrollbarComponent
  ],
  imports: [
    CommonModule,
    DragDropModule
  ],
  exports: [
    CustomScrollbarComponent
  ]
})
export class CustomScrollbarModule { }
