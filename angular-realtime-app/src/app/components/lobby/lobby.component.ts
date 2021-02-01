import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Select } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SocketioService } from 'src/app/services/socketio.service';
import { AppState } from 'src/app/state/app-state';
import { IRoom, User } from '../model';

@Component({
  selector: 'lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css'],
})
export class LobbyComponent implements OnInit, OnDestroy {
  
  @Select(AppState.getUser) userChange$: Observable<User>;
  @Select(AppState.getConnect) connect$: Observable<string>;
  @Select(AppState.getDisconnect) disconnect$: Observable<null>;

  rooms: IRoom[] = [];
  sub = new Subject();

  constructor(
    private socketIoService: SocketioService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.userChange$.pipe(takeUntil(this.sub)).subscribe(user => {
      if (!user) {
        this.router.navigate(['']);
      }
    });
    // this.effects.setRooms$.pipe(takeUntil(this.sub)).subscribe(state => {
    //   this.rooms = state.rooms;
    //   console.log('setRooms', state.payload);
    // })
    // this.effects.setUser$.pipe(takeUntil(this.sub)).subscribe(state => {
    //   console.log('setUser', state.payload);
    //   if (!state.payload.user || !state.payload.user.name) {
    //   }
    // })
  }

  createRoom() {
    this.socketIoService.createRoom();
  }

  ngOnDestroy() {
    this.sub.next();
    this.sub.complete();
  }
}