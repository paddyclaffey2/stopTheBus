
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Select } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Socket } from 'socket.io-client';
import { SocketioService } from 'src/app/services/socketio.service';
import { AppState } from 'src/app/state/app-state';
import { User } from '../model';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent implements OnInit, OnDestroy {

  @Select(AppState.getAllCategories) categories$: Observable<string[]>;
  @Select(AppState.getLettterInPlay) letter$: Observable<string>;
  @Select(AppState.getAdmin) admin$: Observable<string>;
  @Select(AppState.getUser) user$: Observable<User>;

  public categories: string[] = [];
  public lettterInPlay: string;
  public admin: string;
  public user: User;

  public waitingForGameToStart = true;
  public waitingForRoundToStart = false;
  public roundInProgress = false;
  public roundOver = false;
  public gameOver = false;

  private sub = new Subject();

  private socket: Socket;

  constructor(
    private socketIoService: SocketioService,
    private route: ActivatedRoute,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.categories$.pipe(takeUntil(this.sub)).subscribe(categories => {
      this.categories = categories;
    });
    this.user$.pipe(takeUntil(this.sub)).subscribe(user => {
      this.user = user;
    });
    this.admin$.pipe(takeUntil(this.sub)).subscribe(admin => {
      this.admin = admin;
    });
    this.letter$.pipe(takeUntil(this.sub)).subscribe(lettterInPlay => {
      this.lettterInPlay = lettterInPlay;
    });
    this.socket = this.socketIoService.getSocket();
    this.subscribeToEvents();
  }

  private subscribeToEvents() {
    this.socket.on('game-ready', () => {
      this.waitingForGameToStart = false;
      this.waitingForRoundToStart = true;
    });

    this.socket.on('begin-guessing', (letter: string) => {
      console.log('begin-guessing: ', letter);
      this.lettterInPlay = letter;
      this.waitingForRoundToStart = false;
      this.roundInProgress = true;
    });
  }
  // 

  public ngOnDestroy(): void {
    this.sub.next();
    this.sub.complete();
  }

  public startGame() {
    this.socketIoService.startGame();
  }

  public startRound() {
    this.socketIoService.startRound();
  }

  public isAdmin(): boolean {
    return this.admin && this.user.name === this.admin;
  }

}