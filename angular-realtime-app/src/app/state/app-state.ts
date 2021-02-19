import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { IScore, User } from '../components/model';
import { SetUser, Clear, Connect, Disconnect, ConnectedUsers, SetAdmin, SetAllCategories, SetLetterInPlay, SetPlayedLetters, SetEventStopRound } from './app.actions';

export interface AppStateModel {
  user: User,
  socketId: string,
  connectedUsers: string[],
  admin: string,
  letterInPlay: string;
  allCategories: string[];
  playedLetters: { name: string, scores: IScore[] }[];

  eventStopRound: any,
}

@State<AppStateModel>({
  name: 'app',
  defaults: {
    user: null,
    socketId: null,
    connectedUsers: [],
    admin: null,

    letterInPlay:  null,
    allCategories: null,
    playedLetters: null,

    eventStopRound: null,
  }
})
@Injectable()
export class AppState {

  @Selector()
  static getUser(state: AppStateModel) {
    return state.user;
  }

  @Selector()
  static getConnect(state: AppStateModel) {
    return state.socketId;
  }

  @Selector()
  static getDisconnect(state: AppStateModel) {
    return;
  }

  @Selector()
  static getConnectedUser(state: AppStateModel) {
    return state.connectedUsers;
  }

  @Selector()
  static getAdmin(state: AppStateModel) {
    return state.admin;
  }

  @Selector()
  static getLettterInPlay(state: AppStateModel) {
    return state.letterInPlay;
  }

  @Selector()
  static getAllCategories(state: AppStateModel) {
    return state.allCategories;
  }

  @Selector()
  static getPlayedLetters(state: AppStateModel) {
    return state.playedLetters;
  }

  @Selector()
  static getEventStopRound(state: AppStateModel) {
    return state.eventStopRound;
  }

  @Action(SetUser)
  setUser(ctx: StateContext<AppStateModel>, { payload }: SetUser) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      user: payload,
    });
  }

  @Action(Clear)
  clear(ctx: StateContext<AppStateModel>, { payload }: Clear) {
    ctx.setState({
      user: null,
      socketId: null,
      connectedUsers: [],
      admin: null,
      letterInPlay: null,
      allCategories: null,
      playedLetters: null,
      eventStopRound: null,
    })
  }

  @Action(ConnectedUsers)
  connectedUsers(ctx: StateContext<AppStateModel>, { payload }: ConnectedUsers) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      connectedUsers: payload,
    });
  }

  @Action(Connect)
  connect(ctx: StateContext<AppStateModel>, { payload }: Connect) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      socketId: payload,
    });
  }

  @Action(Disconnect)
  disconnect(ctx: StateContext<AppStateModel>, { payload }: Disconnect) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      socketId: null,
    });
  }

  @Action(SetAdmin)
  setAdmin(ctx: StateContext<AppStateModel>, { payload }: SetAdmin) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      admin: payload,
    });
  }

  @Action(SetLetterInPlay)
  setLetterInPlay(ctx: StateContext<AppStateModel>, { payload }: SetLetterInPlay) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      letterInPlay: payload,
    });
  }

  @Action(SetAllCategories)
  setAllCategories(ctx: StateContext<AppStateModel>, { payload }: SetAllCategories) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      allCategories: payload,
    });
  }

  @Action(SetEventStopRound)
  setEventStopRound(ctx: StateContext<AppStateModel>, { payload }: SetEventStopRound) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      eventStopRound: payload,
    });
  }
}