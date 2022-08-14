import { useEffect, useCallback } from "react";
import RNBootSplash from "react-native-bootsplash";

export const useAppInitial = () => {
  useEffect(() => {
    // TODO: loading something in initial
  }, []);

  const init = useCallback(async () => {
    // TODO: something need to load after state is ready
    RNBootSplash.hide({ fade: true });
  }, []);

  return init;
};
