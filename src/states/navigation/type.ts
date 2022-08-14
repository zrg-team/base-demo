export enum STATE_KEYS {
  initialScreenState = "initialScreenState",
  initialNavigationState = "initialNavigationState",
}

export type InitialScreenStateResponse = undefined | string;
export type InitialNavigationStateResponse = undefined | string;

export type NavigationStateReponse =
  | InitialScreenStateResponse
  | InitialNavigationStateResponse;
