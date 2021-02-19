import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'catergory-input',
  templateUrl: './catergory-input.component.html',
  styleUrls: ['./catergory-input.component.css']
})
export class CatergoryInputComponent implements OnInit {

  @Input() name: string;
  @Input() form: FormGroup;
  @Input() control: FormControl;

  constructor() { }

  ngOnInit(): void {
  }

}
