import React from "react";
import { RouteProp, useNavigationState } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import {
  createBottomTabNavigator,
  BottomTabNavigationProp,
} from "@react-navigation/bottom-tabs";
import useNavigationService from "@services/navigation";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import defaultConfig from "@navigation/config";
import Tabbar from "@components/molecules/Tabbar";

export type UnAuthenticatedScreenNameType = {
  AUTHENTICATED: string;
  HOME_TAB: string;
  HOME_HOME_TAB_1: string;
  HOME: string;
  DETAIL_HOME_TAB_2: string;
  DETAIL: string;
  ADD_TODO_HOME_TAB_3: string;
  ADD_TODO: string;
  USER_TAB: string;
  USER_USER_TAB_1: string;
  USER: string;
  CANVAS: string;
};

export const SCREEN_NAMES: UnAuthenticatedScreenNameType = {
  AUTHENTICATED: "Authenticated",
  HOME_TAB: "HomeTab",
  HOME_HOME_TAB_1: "Home_HomeTab_1",
  HOME: "Home",
  DETAIL_HOME_TAB_2: "Detail_HomeTab_2",
  DETAIL: "Detail",
  ADD_TODO_HOME_TAB_3: "AddTodo_HomeTab_3",
  ADD_TODO: "AddTodo",
  USER_TAB: "UserTab",
  USER_USER_TAB_1: "User_UserTab_1",
  USER: "User",
  CANVAS: "Canvas",
};

const UserTabStackScreenOptions = {
  headerShown: false,
  gestureEnabled: true,
  ...defaultConfig,
};
const UserTabStackProps = {};
type UserTabNavigationPropsType = {
  navigation?: NativeStackNavigationProp<Record<string, {}>, "UserTabStack">;
  route?: RouteProp<Record<string, {}>, "UserTabStack">;
};
const UserTabNavigation = createNativeStackNavigator();
const UserTabStack: React.FunctionComponent<UserTabNavigationPropsType> = (
  props: UserTabNavigationPropsType
) => {
  let initialRouteName;

  const { navigation, route } = props;
  const currentRoute = useNavigationState((inState) =>
    inState.routes.find((item) => item.key === route?.key)
  );

  if (currentRoute?.state?.index) {
    navigation?.setOptions({
      // @ts-ignore
      tabbarHide: true,
    });
  } else {
    navigation?.setOptions({
      // @ts-ignore
      tabbarHide: false,
    });
  }

  const navigationService = useNavigationService();
  const initialScreenNavigation = navigationService.get("initialScreenState");

  return (
    <UserTabNavigation.Navigator
      {...props}
      {...UserTabStackProps}
      initialRouteName={initialRouteName || initialScreenNavigation}
      screenOptions={UserTabStackScreenOptions}
    >
      <UserTabNavigation.Screen
        options={{}}
        name={SCREEN_NAMES.USER}
        component={require("@screens/Welcome").default}
      />
    </UserTabNavigation.Navigator>
  );
};

const HomeTabStackScreenOptions = {
  headerShown: false,
  gestureEnabled: true,
  ...defaultConfig,
};
const HomeTabStackProps = {};
type HomeTabNavigationPropsType = {
  navigation?: NativeStackNavigationProp<Record<string, {}>, "HomeTabStack">;
  route?: RouteProp<Record<string, {}>, "HomeTabStack">;
};
const HomeTabNavigation = createSharedElementStackNavigator();
const HomeTabStack: React.FunctionComponent<HomeTabNavigationPropsType> = (
  props: HomeTabNavigationPropsType
) => {
  let initialRouteName;

  const { navigation, route } = props;
  const currentRoute = useNavigationState((inState) =>
    inState.routes.find((item) => item.key === route?.key)
  );

  if (currentRoute?.state?.index) {
    navigation?.setOptions({
      // @ts-ignore
      tabbarHide: true,
    });
  } else {
    navigation?.setOptions({
      // @ts-ignore
      tabbarHide: false,
    });
  }

  const navigationService = useNavigationService();

  const initialScreenNavigation = navigationService.get("initialScreenState");

  return (
    <HomeTabNavigation.Navigator
      {...props}
      {...HomeTabStackProps}
      initialRouteName={initialRouteName || initialScreenNavigation}
      screenOptions={HomeTabStackScreenOptions}
    >
      <HomeTabNavigation.Screen
        options={{}}
        name={SCREEN_NAMES.HOME}
        component={require("@screens/Home").default}
      />
      <HomeTabNavigation.Screen
        options={{}}
        name={SCREEN_NAMES.DETAIL}
        component={require("@screens/Detail").default}
        sharedElements={(route) => {
          const { bookId, animationType } = route.params;
          return [`book.${bookId}.photo.${animationType}`];
        }}
      />
      <HomeTabNavigation.Screen
        options={{}}
        name={SCREEN_NAMES.CANVAS}
        component={require("@screens/Canvas").default}
        sharedElements={(route) => {
          const { item } = route.params;
          return [`item.1.photo`];
        }}
      />
    </HomeTabNavigation.Navigator>
  );
};

const AuthenticatedTabScreenOptions = {
  headerShown: false,
  gestureEnabled: true,
  ...defaultConfig,
};
const AuthenticatedTabProps = {};
type AuthenticatedTabNavigationPropsType = {
  navigation?: BottomTabNavigationProp<Record<string, {}>, "AuthenticatedTab">;
  route?: RouteProp<Record<string, {}>, "AuthenticatedTab">;
};
const AuthenticatedTabNavigation = createBottomTabNavigator();
const AuthenticatedTab: React.FunctionComponent<
  AuthenticatedTabNavigationPropsType
> = (_props: AuthenticatedTabNavigationPropsType) => {
  return (
    <AuthenticatedTabNavigation.Navigator
      {...AuthenticatedTabProps}
      tabBar={(props) => {
        return <Tabbar {...props} />;
      }}
      screenOptions={AuthenticatedTabScreenOptions}
    >
      <AuthenticatedTabNavigation.Screen
        options={{
          ...{},
        }}
        name={SCREEN_NAMES.HOME_TAB}
        component={HomeTabStack}
      />
      <AuthenticatedTabNavigation.Screen
        options={{
          ...{},
        }}
        name={SCREEN_NAMES.USER_TAB}
        component={UserTabStack}
      />
    </AuthenticatedTabNavigation.Navigator>
  );
};

export default AuthenticatedTab;
