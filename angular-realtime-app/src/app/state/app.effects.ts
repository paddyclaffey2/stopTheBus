import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { AppActionTypes } from './app.actions';
import { Observable } from 'rxjs';
import { AppState } from './state.model';

@Injectable()
export class AppEffects {
  constructor(private actions$: Actions) { }

  @Effect()
  setUser$: Observable<AppActionsEffects> = this.actions$.pipe(
    ofType(AppActionTypes.SET_USER),
  );

  @Effect()
  setRooms$: Observable<AppActionsEffects> = this.actions$.pipe(
    ofType(AppActionTypes.SET_ROOMS),
  );
}

export class AppActionsEffects implements Action {
  type: string;
  payload: AppState
}