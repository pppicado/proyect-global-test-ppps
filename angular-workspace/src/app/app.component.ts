import { Component } from '@angular/core';
import { FloatingWindowService } from 'redim-windows';
import { ChartComponent } from './chart/chart.component';
import { FormComponent } from './form/form.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-workspace';

  constructor(private floatingWindowService: FloatingWindowService) {}

  openChart() {
    this.floatingWindowService.open(ChartComponent, {
      title: 'Chart Window',
      width: 500,
      height: 400,
      x: 50,
      y: 300,
      data: { id: 1, name: 'Sample Data' }
    });
  }

  openForm() {
    this.floatingWindowService.open(FormComponent, {
      title: 'Form Window',
      width: 400,
      height: 300,
      x: 300,
      y: 200
    });
  }
}
