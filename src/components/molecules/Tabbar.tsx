import React, { useCallback, useMemo } from "react";
import { useTheme, Pressable } from "native-base";
import { StyleSheet, View, Platform } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import { BlurView } from "@shared/react-native-community/blur";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import Animated, {
  ZoomInEasyDown,
  SlideInUp,
  SlideOutDown,
} from "react-native-reanimated";

const ROUTE_ICONS: Record<string, string> = {
  HomeTab: "book",
  UserTab: "user",
};
const Tabbar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const { colors: themeColors, sizes } = useTheme();
  const currentTabOption = useMemo(() => {
    const currentTab = state.routes.find(
      (_item, index) => state.index === index
    );
    return descriptors[currentTab?.key || -1]?.options;
  }, [state.routes, descriptors]);

  const handlePress = useCallback(
    (key: string, name: string, isFocused: boolean) => {
      const event = navigation.emit({
        type: "tabPress",
        target: key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        // The `merge: true` option makes sure that the params inside the tab screen are preserved
        navigation.navigate({ name: name, merge: true } as never);
      }
    },
    [navigation]
  );

  const tabItems = useMemo(() => {
    return state.routes.map((route, index) => {
      const { options } = descriptors[route.key];

      const isFocused = state.index === index;

      return (
        <Pressable
          key={`${route.key}_${index}`}
          accessibilityRole="button"
          accessibilityState={isFocused ? { selected: true } : {}}
          accessibilityLabel={options.tabBarAccessibilityLabel}
          testID={options.tabBarTestID}
          onPress={() => handlePress(route.key, route.name, isFocused)}
          style={styles.item}
        >
          {({ isPressed }) => (
            <Icon
              size={28}
              color={isFocused ? themeColors.tabFocus : themeColors.tabUnfocus}
              name={ROUTE_ICONS[route.name]}
              style={{
                transform: [
                  {
                    scale: isPressed ? 0.86 : 1,
                  },
                ],
              }}
            />
          )}
        </Pressable>
      );
    });
  }, [handlePress, state.routes, themeColors]);

  // @ts-ignore
  if (currentTabOption.tabbarHide) {
    return null;
  }

  return (
    <View style={[styles.container, { height: sizes.tabbar }]}>
      <Animated.View
        style={styles.inner}
        entering={Platform.select({
          android: SlideInUp,
          ios: ZoomInEasyDown,
        })}
        exiting={SlideOutDown}
      >
        <BlurView
          style={styles.absolute}
          blurType="light"
          blurAmount={10}
          reducedTransparencyFallbackColor="white"
        />
        {tabItems}
      </Animated.View>
    </View>
  );
};

export default Tabbar;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    paddingHorizontal: 50,
    paddingBottom: 15,
    bottom: 0,
  },
  inner: {
    flex: 1,
    borderRadius: 60,
    overflow: "hidden",
    flexDirection: "row",
  },
  absolute: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  item: { flex: 1, justifyContent: "center", alignItems: "center" },
});
