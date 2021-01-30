import { Component, OnDestroy, OnInit } from '@angular/core';
import { IRoom, User } from './components/model';
import { SocketioService } from './services/socketio.service';
import { Socket } from 'socket.io-client';
import { Router } from '@angular/router';
import { ActionAppClear, ActionAppSetRooms, ActionAppSetUser } from './state/app.actions';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppEffects } from './state/app.effects';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  public isConnected = false;
  public numOfConnectedUsers = 0;
  public user: User;

  private socket: Socket;
  private sub = new Subject();

  constructor(
    private socketIoService: SocketioService,
    private route: Router,
    private store: Store,
    private effects: AppEffects,
  ) {
    this.store.dispatch(new ActionAppClear());
  }

  public ngOnInit(): void {
    this.effects.setUser$.pipe(takeUntil(this.sub)).subscribe(state => {
      this.createUser(state.payload.user);
    });
  }

  public ngOnDestroy(): void {
    this.sub.next();
    this.sub.complete();
    this.socketIoService.disconnect();
  }
  
  public createUser(user: User) {
    this.user = user;
    this.connect(user);
    this.subscribeToSocketEvents();
  }

  public sendName(userName: string): void {
    this.socketIoService.sendName(userName);
  }

  private connect(user: User): void {
    this.socket = this.socketIoService.connect(user);
  }

  subscribeToSocketEvents(): void {
    this.socket.on('connect', () => {
      this.isConnected = this.socket.connected;
      this.socket.on('connect', () => {
        console.log(`connected with ${this.socket.id}`);
        this.route.navigate(['lobby'])
     });
    });

    this.socket.on('disconnect', () => {
      this.isConnected = this.socket.connected;
    });

    this.socket.on('numberOfUserChanges', (data: number) => {
      this.numOfConnectedUsers = data;
    });

    this.socket.on('roomList ', (rooms: IRoom[]) => {
      this.store.dispatch(new ActionAppSetRooms({ rooms }))
    });
  }
}
