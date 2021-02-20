
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Socket } from 'socket.io-client';
import { SocketioService } from 'src/app/services/socketio.service';
import { AppState } from 'src/app/state/app-state';
import { SetEventStopRound } from 'src/app/state/app.actions';
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
  public resultsTable: IResults;
  public allUsers: string[];

  public scoringCategory = '';
  public isScoreSubmittedForCategory = false;
  public showFinalcodeSubmit = false;
  public isRoundComplete = false;
  public isAllScoresSubmitted = false;
  private categoriesToScore: string[] = [];
  public roundScore = 0;
  public usersWhoSubmittedScore: string[] = [];
  public hasRequestedFinalScores = false;
  
  public scores: {
    [key: string]: number
  }

  public waitingForGameToStart = true;
  public waitingForRoundToStart = false;
  public roundInProgress = false;
  public roundOver = false;
  public gameOver = false;

  private sub = new Subject();

  private socket: Socket;

  constructor(
    private socketIoService: SocketioService,
    private store: Store,
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

  private resetGameStatus(): void {
    this.waitingForGameToStart = false;
    this.waitingForRoundToStart = false;
    this.roundInProgress = false;
    this.roundOver = false;
    this.gameOver = false;
  }

  private subscribeToEvents() {
    this.socket.on('game-ready', () => {
      this.resetGameStatus();
      this.waitingForRoundToStart = true;
    });

    this.socket.on('begin-guessing', (letter: string) => {
      console.log('begin-guessing: ', letter);
      this.lettterInPlay = letter;
      this.resetGameStatus();
      this.roundInProgress = true;
    });

    this.socket.on('all-answers-for-round-recieved', (results: IResults) => {
      this.store.dispatch(new SetEventStopRound(null));
      console.log('all-answers-for-round-recieved: ', results);
      this.resultsTable = results;
      this.allUsers = Object.keys(results);
      this.roundInProgress = false;
      this.roundOver = true;
      this.roundScore = 0;
      this.categoriesToScore = [ ...this.categories ];
      this.usersWhoSubmittedScore = [];
      this.showFinalcodeSubmit = false;
      this.hasRequestedFinalScores = false;
    });

    this.socket.on('now-scoring', (category: string) => {
      this.scoringCategory = category;
      this.isScoreSubmittedForCategory = false;
    });

    this.socket.on('updated-score-user-list', (usersWhoSubmittedScore: string[]) => {
      this.usersWhoSubmittedScore = usersWhoSubmittedScore;
    });

    this.socket.on('updated-score-user-list', (usersWhoSubmittedScore: string[]) => {
      this.usersWhoSubmittedScore = usersWhoSubmittedScore;
    });

    this.socket.on('enable-score-button-true', () => {
      this.showFinalcodeSubmit = true;
    });
    
    this.socket.on('game-score-update', (scores) => {
      this.scores = scores;
    });

    this.socket.on('game-over-over', () => {
      this.resetGameStatus();
      this.gameOver = true;
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

  public getUserAnswers(userName: string, category: string): string {
    return this.resultsTable[userName][this.lettterInPlay].filter(answer => answer.catergoryName === category)[0].answer;
  }

  public submitAllScore(): void {
    console.log('submitScore');
    this.socket.emit('final-round-score-submitted', { score: this.roundScore, userName: this.user.name, letter: this.lettterInPlay });
  }

  public requestFinalScores(): void {
    this.socket.emit('enable-score-button');
    this.hasRequestedFinalScores = true;
  }

  public nextRound() :void {
    this.socket.emit('next-round');
  }

  public submitCategoryScore(score: number) {
    this.roundScore += score;
    this.isScoreSubmittedForCategory = true;
    this.socket.emit('category-score-submitted', { userName: this.user.name });
  }

  public isAdmin(): boolean {
    return this.admin && this.user.name === this.admin;
  }

  public nextCategory() :void {
    this.socket.emit('next-category', { category: this.categoriesToScore.shift() });
  }

  public finshGame() {
    this.socket.emit('game-over');
  }
}

interface IResults {
  [key: string]: { // Player Name
    [key: string]: // letter
      ISubmittedAnswers[]
  }
}

export interface ISubmittedAnswers {
  catergoryName: string,
  answer: string,
  score: number,
}