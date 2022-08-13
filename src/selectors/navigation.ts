import { createSelector, OutputSelector } from 'reselect';
import { NavigationState } from '@reducers/navigation';

export type NavigationInitialNavigationSelectorResponse = OutputSelector<
  any,
  any,
  (res: any) => string | null
>;
export type NavigationInitialScreenSelectorResponse = OutputSelector<
  any,
  any,
  (res: any) => string | null
>;
export type NavigationSelectorResponse = OutputSelector<
  any,
  any,
  (res: any) => NavigationState
>;

const initialNavigation: NavigationInitialNavigationSelectorResponse =
  createSelector(
    (state: any) => state.navigation.initialNavigation,
    (result: string | null) => result,
  );

const initialScreen: NavigationInitialScreenSelectorResponse = createSelector(
  (state: any) => state.navigation.initialScreen,
  (result: string | null) => result,
);

export const allNavigation: NavigationSelectorResponse = createSelector(
  (state: any) => state.navigation,
  (navigation: NavigationState) => navigation,
);

export type NavigationSelectorType = {
  initialNavigation: NavigationInitialNavigationSelectorResponse;
  initialScreen: NavigationInitialScreenSelectorResponse;
};

const selectors: NavigationSelectorType = {
  initialNavigation,
  initialScreen,
};

export default selectors;
