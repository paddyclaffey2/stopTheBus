import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatergoryInputComponent } from './catergory-input.component';

describe('CatergoryInputComponent', () => {
  let component: CatergoryInputComponent;
  let fixture: ComponentFixture<CatergoryInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatergoryInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CatergoryInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
