import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { IRoom, User } from '../components/model';
import { Store } from '@ngxs/store';
import { Connect, ConnectedUsers, Disconnect, SetRooms } from '../state/app.actions';

@Injectable({
  providedIn: 'root',
})
export class SocketioService {
  
  private socket: Socket;
  private user: User;

  constructor(private store: Store) {}

  public connect(user: User) {
    this.socket = io(environment.SOCKET_ENDPOINT);
    this.user = user;
    this.subscribeToSocketEvents();
  }

  public disconnect() {
    this.socket.disconnect();
  }

  public getSocket(): Socket {
    return this.socket;
  }

  public createRoom(): void {
    this.socket.emit('create-room', this.user.name);
  }

  public joinRoom(): void {
    this.socket.emit('join-room', this.user.name);
  }

  subscribeToSocketEvents(): void {
    this.socket.on('connect', () => {
      this.sendName(this.user.name);
    });

    this.socket.on('disconnect', () => {
      this.store.dispatch(new Disconnect(null));
    });

    this.socket.on('confirm-name', (isNameTaken: boolean) => {
      if (isNameTaken) {
        console.error('user name taken');
        this.store.dispatch(new Disconnect(null));
      } else {
        this.store.dispatch(new Connect(this.socket.id));
      }
    });

    this.socket.on('number-of-user-changed', (data: number) => {
      this.store.dispatch(new ConnectedUsers(data));
    });

    this.socket.on('roomList ', (rooms: IRoom[]) => {
      this.store.dispatch(new SetRooms(rooms));
    });
    
    this.socket.on('roomList ', (rooms: IRoom[]) => {
      this.store.dispatch(new SetRooms(rooms));
    });
  }

  sendName(userName: string) {
    this.socket.emit('sendName', { userName });
  }


  startGame(gameId) {
    this.socket.emit('startGame', { gameId: gameId });
  }

  sendGameUpdate(gameId, words) {
    this.socket.emit('gameUpdate', { gameId: gameId, words: words });
  }

  recieveJoinedPlayers() {
    return new Observable((observer) => {
      this.socket.on('joinGame', (message) => {
        observer.next(message);
      });
    });
  }

  recieveStartGame() {
    return new Observable((observer) => {
      this.socket.on('startGame', (words) => {
        observer.next(words);
      });
    });
  }

  recieveGameUpdate(gameId) {
    return new Observable((observer) => {
      this.socket.on(gameId, (words) => {
        observer.next(words);
      });
    });
  }
}