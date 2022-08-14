import { atom } from "recoil";
import { persistAtom } from "@utils/persistState";
import {
  InitialNavigationStateResponse,
  InitialScreenStateResponse,
  STATE_KEYS,
} from "./type";

export const initialScreenState = atom<InitialScreenStateResponse>({
  key: STATE_KEYS.initialScreenState,
  default: undefined,
  effects_UNSTABLE: [persistAtom(STATE_KEYS.initialScreenState)],
});

export const initialNavigationState = atom<InitialNavigationStateResponse>({
  key: STATE_KEYS.initialNavigationState,
  default: undefined,
  effects_UNSTABLE: [persistAtom(STATE_KEYS.initialNavigationState)],
});
