import { createSelector } from "@ngrx/store";
import { IRoom, User } from "../components/model";

export class AppState {
  user: User;
  socketId: string;
  rooms: IRoom[];
}

export const getAppState = (state: AppState) => state;

export const getAppUserState = (state: AppState) => state.user;
export const selectAppState =  createSelector(getAppState, getAppUserState);
export const selectAppUserState = (state: AppState) => state.user;


export const getAppRoomState = (state: AppState) => state.rooms;
export const selectAppRoomState =  createSelector(getAppState, getAppUserState);