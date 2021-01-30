import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ActionAppSetUser, } from 'src/app/state/app.actions';
import { User } from '../model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

  constructor(
    private store: Store,
    private route: Router,) {
  }

  public ngOnInit(): void {
  }
  
  public createUser(user: User) {
    this.store.dispatch(new ActionAppSetUser({ user }));
    this.route.navigate(['lobby']);
  }

}