import { createAction, ActionFunctionAny, Action } from 'redux-actions';

export const setInitialNavigation: ActionFunctionAny<Action<string>> =
  createAction('SET_INITIAL_NAVIGATION');
export const setInitialScreen: ActionFunctionAny<Action<string>> =
  createAction('SET_INITIAL_SCREEN');
export const clearNavigation: ActionFunctionAny<Action<undefined>> =
  createAction('CLEAR_NAVIGATION');

export const setNavigation: ActionFunctionAny<Action<NavigationPayLoad>> =
  createAction('SET_NAVIGATION_SESSION');

export interface NavigationPayLoad {
  key: string;
  value?: any;
}
