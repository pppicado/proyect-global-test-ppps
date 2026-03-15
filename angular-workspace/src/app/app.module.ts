import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RedimFrameModule } from '@pppicado/redim-frame';

import { AppComponent } from './app.component';
import { ChartComponent } from './chart/chart.component';
import { FormComponent } from './form/form.component';

@NgModule({
  declarations: [
    AppComponent,
    ChartComponent,
    FormComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    RedimFrameModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
