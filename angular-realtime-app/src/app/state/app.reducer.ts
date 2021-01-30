import { AppActions, AppActionTypes } from './app.actions';
import { AppState } from './state.model';

export const initialState: AppState = {
    user: null,
    socketId: null,
    rooms: [],
};

export function reducer(state = initialState, action: AppActions) {
  switch (action.type) {
    case AppActionTypes.CLEAR: {
      return {
        user: null,
        socketId: null,
      }
    }
    case AppActionTypes.SET_USER: {
      return {
        ...state,
        user: action.payload.user
      } as AppState
    }
    case AppActionTypes.SET_ROOMS: {
      return {
        ...state,
        rooms: action.payload.rooms
      } as AppState
    }
    case AppActionTypes.CONNECT: {
      return {
        ...state,
        socketId:  action.payload.socketId,
      } as AppState
    }
    case AppActionTypes.DISCONNECT: {
      return {
        ...state,
        socketId: null,
      } as AppState
    }
    default: {
      return state;
    }
  }
}
