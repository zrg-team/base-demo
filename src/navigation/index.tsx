import React, { useMemo, useRef, createRef, useEffect } from "react";
import { Platform } from "react-native";
import {
  NavigationContainer,
  NavigationContainerRef,
} from "@react-navigation/native";
import UnAuthenticated, {
  SCREEN_NAMES as UN_AUTHENTICATED,
  UnAuthenticatedScreenNameType,
} from "@navigation/unAuthenticated";
import Authenticated, {
  SCREEN_NAMES as AUTHENTICATED,
  AuthenticatedScreenNameType,
} from "@navigation/authenticated";
import useNavigationService from "@services/navigation";

type NavigationScreenNameType = {
  [key: string]: string;
} & UnAuthenticatedScreenNameType &
  AuthenticatedScreenNameType;

export const SCREEN_NAMES: NavigationScreenNameType = {
  ...UN_AUTHENTICATED,
  ...AUTHENTICATED,
};
type FlowNameType = {
  UN_AUTHENTICATED: string;
  AUTHENTICATED: string;
};

export const FLOW_NAMES: FlowNameType = {
  UN_AUTHENTICATED: "UnAuthenticated",
  AUTHENTICATED: "Authenticated",
};

export default function Navigator({
  onLoaded,
}: {
  onLoaded: () => void;
}): JSX.Element {
  const navigationRef = createRef<NavigationContainerRef<Record<string, {}>>>();
  const routeNameRef = useRef<string>();
  const previousRouteNameRef = useRef<string>();
  const navigationService = useNavigationService();
  const initialNavigationNavigation = navigationService.get(
    "initialNavigationState"
  );
  useEffect(() => {
    // @ts-ignore
    if (Platform.OS === "web" && typeof window === "object") {
      // @ts-ignore
      window.onhashchange = ({ target }) => {
        const hash = `${target.location.hash}`.replace("#/", "");
        if (
          navigationRef.current &&
          navigationRef.current.canGoBack() &&
          hash !== routeNameRef.current &&
          routeNameRef.current !== previousRouteNameRef.current
        ) {
          navigationRef.current.goBack();
        }
      };
    }
    return () => {
      // @ts-ignore
      if (Platform.OS === "web" && typeof window === "object") {
        // @ts-ignore
        window.onhashchange = undefined;
      }
    };
  }, []);
  const mainNavigation = useMemo(() => {
    if (initialNavigationNavigation === "UnAuthenticated") {
      return <UnAuthenticated />;
    }
    if (initialNavigationNavigation === "Authenticated") {
      return <Authenticated />;
    }
    return <UnAuthenticated />;
  }, [initialNavigationNavigation]);
  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        onLoaded();
        routeNameRef.current = navigationRef.current?.getCurrentRoute()?.name;
      }}
      onStateChange={() => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.current?.getCurrentRoute()?.name;

        previousRouteNameRef.current = previousRouteName;
        routeNameRef.current = currentRouteName;
      }}
    >
      {mainNavigation}
    </NavigationContainer>
  );
}
