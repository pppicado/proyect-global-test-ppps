import { Component, Inject, Optional } from '@angular/core';
import { WINDOW_DATA } from '@pppicado/redim-frame';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent {
  constructor(@Optional() @Inject(WINDOW_DATA) public data: any) { }
}
