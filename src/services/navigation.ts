import { useDispatch, useSelector } from 'react-redux';
import { getKeyValue } from '@utils/types';
import {
  setNavigation,
  clearNavigation,
  setInitialScreen,
  setInitialNavigation,
} from '@actions/navigation';
import navigationSelectors, {
  NavigationSelectorType,
} from '@selectors/navigation';

export default function useNavigationService(): NavigationServiceType {
  const dispatch = useDispatch();

  return {
    get: (key: keyof NavigationSelectorType) => {
      const selector: any = getKeyValue(navigationSelectors, key);
      return useSelector(selector);
    },
    setValue: (key: string, value: any) => {
      dispatch(setNavigation({ key, value }));
    },
    setInitialScreen: (screen: string) => {
      dispatch(setInitialScreen(screen));
    },
    setInitialNavigation: (screen: string) => {
      dispatch(setInitialNavigation(screen));
    },
    clearNavigation: () => {
      dispatch(clearNavigation());
    },
  };
}

export type NavigationServiceType = {
  get: (key: keyof NavigationSelectorType) => any;
  setValue: (key: string, value: any) => void;
  setInitialScreen: (screen: string) => void;
  setInitialNavigation: (screen: string) => void;
  clearNavigation: () => void;
};
