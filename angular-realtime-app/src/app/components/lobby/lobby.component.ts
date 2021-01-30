import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SocketioService } from 'src/app/services/socketio.service';
import { AppEffects } from 'src/app/state/app.effects';
import { IRoom } from '../model';

@Component({
  selector: 'lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css'],
})
export class LobbyComponent implements OnInit, OnDestroy {

  rooms: IRoom[] = [];
  sub = new Subject();

  constructor(
    private router: Router,
    private store: Store,
    private effects: AppEffects,
    private socketIoService: SocketioService,
  ) {}

  ngOnInit(): void {
    this.effects.setRooms$.pipe(takeUntil(this.sub)).subscribe(state => {
      this.rooms = state.payload.rooms;
      console.log('setRooms', state.payload);
    })
    this.effects.setUser$.pipe(takeUntil(this.sub)).subscribe(state => {
      console.log('setUser', state.payload);
      if (!state.payload.user || !state.payload.user.name) {
        this.router.navigate(['home']);
      }
    })
  }

  createRoom() {
    this.socketIoService.createRoom();
  }

  ngOnDestroy() {
    this.sub.next();
    this.sub.complete();
  }
}