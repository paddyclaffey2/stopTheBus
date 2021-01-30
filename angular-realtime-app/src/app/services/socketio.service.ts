import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { User } from '../components/model';

@Injectable({
  providedIn: 'root',
})
export class SocketioService {
  
  private socket: Socket;
  private user: User;

  constructor() {}

  public connect(user: User): Socket {
    this.socket = io(environment.SOCKET_ENDPOINT);
    this.socket.on('connect', () => {
      this.user = user;
      this.socket.emit('sendName', { userName: user.name });
    });
    return this.socket;
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

  sendName(userName: string) {
    console.log('sending name');
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