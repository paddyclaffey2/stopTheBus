import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { IRoom, User } from '../components/model';
import { SetUser, Clear, SetRooms, Connect, Disconnect, ConnectedUsers } from './app.actions';

export interface AppStateModel {
  user: User,
  socketId: string,
  rooms: IRoom[],
  connectedUsers: number,
}

@State<AppStateModel>({
  name: 'app',
  defaults: {
    user: null,
    socketId: null,
    rooms: [],
    connectedUsers: 0,
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
  static getRooms(state: AppStateModel) {
      return state.rooms;
  }

  @Selector()
  static getConnectedUser(state: AppStateModel) {
      return state.connectedUsers;
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
      rooms: null,
      connectedUsers: 0,
    })
  }

  @Action(SetRooms)
  setRooms(ctx: StateContext<AppStateModel>, { payload }: SetRooms) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      rooms: payload,
    });
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
}