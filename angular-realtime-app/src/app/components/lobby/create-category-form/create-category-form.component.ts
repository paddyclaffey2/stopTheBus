import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { SocketioService } from 'src/app/services/socketio.service';

@Component({
  selector: 'create-category-form',
  templateUrl: './create-category-form.component.html',
  styleUrls: ['./create-category-form.component.css']
})
export class CreateCategoryFormComponent implements OnInit {

  readonly MAX_CATEGORY = 10;

  public categoryForm: FormGroup;

  constructor(
      private formBuilder: FormBuilder,
      private socketioService: SocketioService,
    ) {
    this.categoryForm = formBuilder.group({
      category: formBuilder.array([])
    })
  }

  addNewCategory(index?: string) {
    const add = this.categoryForm.get('category') as FormArray;
    add.push(this.formBuilder.group({
      name: ['aaaaa' + index, [Validators.required, Validators.minLength(5)]],
    }))
  }

  deleteCategory(index: number) {
    const add = this.categoryForm.get('category') as FormArray;
    add.removeAt(index)
  }
  
  ngOnInit(): void {
    for( let i = 0; i < this.MAX_CATEGORY; i++) {
      this.addNewCategory(String(i));
    }
  }

  public onSubmit() {
    const cateogries = this.categoryForm.value.category as { name: string }[];
    const cateogryNames: string[] = cateogries.map(one => one.name);
    this.socketioService.setCategories(cateogryNames)
  }

}
