import {
  setNavigation,
  clearNavigation,
  setInitialScreen,
  setInitialNavigation,
  NavigationPayLoad,
} from '@actions/navigation';
import { handleActions, Action } from 'redux-actions';

export interface NavigationState {
  initialNavigation: string | null;
  initialScreen: string | null;
}

const initialState: NavigationState = {
  initialNavigation: null,
  initialScreen: null,
};

const handlers = {
  [`${clearNavigation}`]: () => initialState,
  [`${setNavigation}`]: (
    state: NavigationState,
    action: Action<NavigationPayLoad | any>,
  ) => ({
    ...state,
    loading: true,
    [action.payload.key]: [action.payload.value],
  }),
  [`${setInitialScreen}`]: (
    state: NavigationState,
    action: Action<string>,
  ) => ({
    ...state,
    initialScreen: action.payload,
  }),
  [`${setInitialNavigation}`]: (
    state: NavigationState,
    action: Action<string>,
  ) => ({
    ...state,
    initialScreen: '',
    initialNavigation: action.payload,
  }),
};

export default handleActions(handlers, initialState);
