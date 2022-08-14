import { selector } from "recoil";
import { initialNavigationState, initialScreenState } from "./atoms";
import {
  InitialNavigationStateResponse,
  InitialScreenStateResponse,
} from "./type";

export const getNavigationInfo = selector<{
  initialScreen?: InitialScreenStateResponse;
  initialNavigation?: InitialNavigationStateResponse;
}>({
  key: "getNavigationInfo",
  get({ get }) {
    const initialScreen = get(initialScreenState);
    const initialNavigation = get(initialNavigationState);
    return {
      initialScreen,
      initialNavigation,
    };
  },
});
