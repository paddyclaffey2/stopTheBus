import { Action } from '@ngrx/store';
import { IRoom, User } from '../components/model';

export enum AppActionTypes {
    CLEAR = '[App] Clear State',
    SET_USER = '[App] Set User',
    SET_ROOMS = '[App] Set Rooms',
    GET_STATE = 'App] Get State',
    CONNECT = '[App] Connect',
    DISCONNECT = '[App] Disconnect',
}

export class ActionAppClear implements Action {
    readonly type = AppActionTypes.CLEAR;
    constructor() { }
}

export class ActionAppSetUser implements Action {
    readonly type = AppActionTypes.SET_USER;
    constructor(readonly payload: { user: User }) {}
}

export class ActionAppSetRooms implements Action {
    readonly type = AppActionTypes.SET_ROOMS;
    constructor(readonly payload: { rooms: IRoom[] }) {}
}

export class ActionAppConnect implements Action {
    readonly type = AppActionTypes.CONNECT;
    constructor(readonly payload: { socketId: string }) { }
}

export class ActionAppDisconnect implements Action {
  readonly type = AppActionTypes.DISCONNECT;
  constructor() { }
}

export type AppActions =
    ActionAppClear |
    ActionAppSetUser |
    ActionAppSetRooms |
    ActionAppConnect |
    ActionAppDisconnect;
