import { User, IRoom } from "../components/model";

export enum AppActionTypes {
  CLEAR = '[App] Clear',
  SET_USER = '[App] Set User',
  SET_ROOMS = '[App] Set Rooms',
  GET_STATE = 'App] Get',
  CONNECT = '[App] Connect',
  DISCONNECT = '[App] Disconnect',
  CONNECTED_USER = '[App] ConnectedUser',
}

export class SetUser {
  static readonly type = AppActionTypes.SET_USER;
  constructor(public payload: User) { }
}

export class Clear {
  static readonly type = AppActionTypes.CLEAR;
  constructor(public payload: string) { }
}

export class SetRooms {
  static readonly type = AppActionTypes.SET_ROOMS;
  constructor(public payload: IRoom[]) { }
}

export class Connect {
  static readonly type = AppActionTypes.CONNECT;
  constructor(public payload: string) { }
}

export class Disconnect {
  static readonly type = AppActionTypes.DISCONNECT;
  constructor(public payload: {}) { }
}

export class ConnectedUsers {
  static readonly type = AppActionTypes.CONNECTED_USER;
  constructor(public payload: number) { }
}
