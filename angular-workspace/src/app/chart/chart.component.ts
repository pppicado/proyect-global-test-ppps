import { Component, Inject, Optional } from '@angular/core';
import { WINDOW_DATA } from '@pppicado/redim-frame';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent {
  constructor(@Optional() @Inject(WINDOW_DATA) public data: any) { }
}
