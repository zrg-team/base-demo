import { useSetRecoilState, useRecoilValue } from "recoil";
import {
  STATE_KEYS,
  initialScreenState,
  initialNavigationState,
} from "@states/navigation";
import type { NavigationStateReponse } from "@states/navigation";

export default function useNavigationService(): NavigationServiceType {
  const setInitialScreen = useSetRecoilState(initialScreenState);
  const setInitialNavigation = useSetRecoilState(initialNavigationState);
  return {
    get: (key: string) => {
      switch (key) {
        case STATE_KEYS.initialScreenState:
          return useRecoilValue(initialScreenState);
        case STATE_KEYS.initialScreenState:
          return useRecoilValue(initialNavigationState);
      }
    },
    setInitialScreen: (screen: string) => {
      setInitialScreen(screen);
    },
    setInitialNavigation: (screen: string) => {
      setInitialNavigation(screen);
    },
    clearNavigation: () => {
      setInitialScreen(undefined);
      setInitialNavigation(undefined);
    },
  };
}

export type NavigationServiceType = {
  get: (key: `${STATE_KEYS}`) => undefined | NavigationStateReponse;
  setInitialScreen: (screen: string) => void;
  setInitialNavigation: (screen: string) => void;
  clearNavigation: () => void;
};
