import React from "react";
import { RouteProp } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import useNavigationService from "@services/navigation";
import defaultConfig from '@navigation/config'

export type AuthenticatedScreenNameType = {
  AUTHENTICATED: string;
  HOME: string;
};
export const SCREEN_NAMES: AuthenticatedScreenNameType = {
  AUTHENTICATED: "authenticated",
  HOME: "Home",
};
const AuthenticatedStackScreenOptions = {
  headerShown: false,
  gestureEnabled: true,
  ...defaultConfig,
};
const AuthenticatedStackProps = {};
type AuthenticatedNavigationPropsType = {
  navigation?: NativeStackNavigationProp<
    Record<string, {}>,
    "AuthenticatedStack"
  >;
  route?: RouteProp<Record<string, {}>, "AuthenticatedStack">;
};
const AuthenticatedNavigation = createNativeStackNavigator();
const AuthenticatedStack: React.FunctionComponent<
  AuthenticatedNavigationPropsType
> = (props: AuthenticatedNavigationPropsType) => {
  let initialRouteName;

  const navigationService = useNavigationService();
  const initialScreenNavigation = navigationService.get("initialScreenState");
  return (
    <AuthenticatedNavigation.Navigator
      {...props}
      {...AuthenticatedStackProps}
      initialRouteName={initialRouteName || initialScreenNavigation}
      screenOptions={AuthenticatedStackScreenOptions}
    >
      <AuthenticatedNavigation.Screen
        options={{}}
        name={SCREEN_NAMES.HOME}
        component={require("@screens/Welcome").default}
      />
    </AuthenticatedNavigation.Navigator>
  );
};
export default AuthenticatedStack;
