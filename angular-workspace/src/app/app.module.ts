import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RedimWindowsModule } from 'redim-windows';

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
    RedimWindowsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
