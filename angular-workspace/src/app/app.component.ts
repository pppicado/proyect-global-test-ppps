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

  constructor(private floatingWindowService: FloatingWindowService) { }

  openChart() {
    this.floatingWindowService.open(ChartComponent, {
      title: 'Chart Window',
      width: 50,
      height: 40,
      x: 5,
      y: 30,
      data: { id: 1, name: 'Sample Data' }
    });
  }

  openForm() {
    this.floatingWindowService.open(FormComponent, {
      title: 'Form Window',
      width: 40,
      height: 30,
      x: 30,
      y: 20
    });
  }
}
