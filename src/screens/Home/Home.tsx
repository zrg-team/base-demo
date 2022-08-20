import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Platform,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useTheme } from "native-base";
import Icon from "react-native-vector-icons/Ionicons";
import Carousel from "react-native-reanimated-carousel";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import Animated, {
  withTiming,
  interpolate,
  withSequence,
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "@shared/react-native-community/blur";
import { BookImg, imgsPreview, booksList, Book } from "@constants/mocks";
import PosterImage from "@modules/home/components/PosterImage";
import BookCard from "@modules/home/components/BookCard";
import { useTranslation } from "react-i18next";

const { width, height } = Dimensions.get("window");

const CAROUSEL_HEIGHT = 290;
const FIX_HEADER_HEIGHT = 60;
const CAROUSEL_CONFIG = {};

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);
const AnimatedList = Animated.createAnimatedComponent(FlashList);

const Home = () => {
  const animationTimeoutRef = useRef<undefined | any>();
  const backgroundAnimation = useSharedValue(
    Platform.select({ web: 1, default: 0 })
  );
  const [animationColors, setAnimationColors] = useState<string[] | undefined>(
    Platform.select({ web: ["#120A1F", "#120A1F", "#120A1F"] })
  );
  const colorsRef = useRef<Record<string, string[]>>({});
  const [currentSlide, setCurrentSlide] = useState<number | undefined>(
    Platform.select({ web: 0 })
  );
  const translationY = useSharedValue(-CAROUSEL_HEIGHT);
  const navigation = useNavigation();
  const { colors: themeColors, sizes } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    return () => {
      clearTimeout(animationTimeoutRef.current);
    };
  }, []);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    translationY.value = event.contentOffset.y;
  });

  const handleSetColors = useCallback((index: number, colors: string[]) => {
    colorsRef.current[index] = colors;
    if (currentSlide === undefined && index === 0) {
      setCurrentSlide(0);
      setAnimationColors(colors);
      backgroundAnimation.value = withTiming(1, { duration: 1200 });
    }
  }, []);
  const hanldeNavigateBook = useCallback(
    (id: string, animationType: string) => {
      navigation.navigate(
        "Detail" as never,
        { bookId: id, animationType } as never
      );
    },
    [navigation]
  );
  const handleIndexChanged = useCallback((index: number) => {
    setCurrentSlide(index);
    const colors = colorsRef.current[index];
    clearTimeout(animationTimeoutRef.current);
    if (colors) {
      animationTimeoutRef.current = setTimeout(() => {
        setAnimationColors(colors);
      }, 600);
      backgroundAnimation.value = withSequence(
        withTiming(0, { duration: 600 }),
        withTiming(1, { duration: 800 })
      );
    }
  }, []);
  const renderBook = useCallback(
    ({ item, index }: { item: unknown; index: number }) => {
      return (
        <BookCard
          index={index}
          onPress={hanldeNavigateBook}
          book={item as Book}
        />
      );
    },
    []
  );
  const renderSeparator = useCallback(
    () => <View style={styles.separator} />,
    []
  );
  const renderCarousel = useCallback(
    ({ item, index }: { item: BookImg; index: number }) => {
      return (
        <PosterImage
          index={index}
          width={180}
          height={300}
          bookId={item.id}
          uri={item.img}
          onFoundColor={handleSetColors}
          onPress={hanldeNavigateBook}
          sharedAnimationPrefix="poster"
        />
      );
    },
    []
  );
  const keyExtractor = useCallback((item: unknown) => {
    return (item as Book).id;
  }, []);

  const animatedHeaderStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translationY.value,
      [-CAROUSEL_HEIGHT, 50, CAROUSEL_HEIGHT],
      [1, 1, 0],
      "clamp"
    ),
    transform: [
      {
        translateY: interpolate(
          translationY.value,
          [-CAROUSEL_HEIGHT, 0, CAROUSEL_HEIGHT],
          [0, 0, -CAROUSEL_HEIGHT - 90]
        ),
      },
      {
        scale: interpolate(
          translationY.value,
          [-CAROUSEL_HEIGHT, 0, CAROUSEL_HEIGHT],
          [1, 1, 1.6],
          "clamp"
        ),
      },
    ],
  }));
  const animatedBackgroundStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: (backgroundAnimation.value + 0.1) * 1.5,
      },
    ],
    opacity: interpolate(
      backgroundAnimation.value,
      [0, 1],
      [0.4, 0.8],
      "clamp"
    ),
  }));
  const animatedBehindBackgroundStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      backgroundAnimation.value,
      [0, 1],
      [0.4, 0.6],
      "clamp"
    ),
  }));
  const animatedBackgroundHeaderStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translationY.value,
      [-CAROUSEL_HEIGHT, 0, 100, CAROUSEL_HEIGHT],
      [0, 0, 1, 1],
      "clamp"
    ),
  }));

  const behindBackgroundStyle = useMemo(() => {
    return [
      StyleSheet.absoluteFill,
      animatedBehindBackgroundStyle,
      {
        backgroundColor: animationColors?.[0] || themeColors.defaultBackground,
      },
    ];
  }, [animationColors]);
  const listContentStyle = useMemo(() => {
    return {
      paddingBottom: sizes.tabbar,
      paddingTop: CAROUSEL_HEIGHT + FIX_HEADER_HEIGHT + 20,
    };
  }, []);
  const headerBlurStyles = useMemo(() => {
    if (Platform.OS === "web") {
      return [styles.headerBackgroundWeb, { zIndex: 1 }];
    }
    return [
      styles.headerBackground,
      { height: FIX_HEADER_HEIGHT + insets?.top, top: -insets?.top },
      animatedBackgroundHeaderStyle,
    ];
  }, [animatedBackgroundHeaderStyle, insets?.top]);
  const containerStyles = useMemo(() => {
    return [styles.container, { marginTop: insets?.top }];
  }, [insets?.top]);

  return (
    <>
      <Animated.View style={behindBackgroundStyle} />
      {animationColors ? (
        <AnimatedGradient
          colors={animationColors}
          style={[styles.background, animatedBackgroundStyle]}
        />
      ) : null}
      <View style={containerStyles}>
        <AnimatedList
          contentContainerStyle={listContentStyle}
          data={booksList}
          keyExtractor={keyExtractor}
          renderItem={renderBook}
          onScroll={scrollHandler}
          ItemSeparatorComponent={renderSeparator}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        />
        <Animated.View style={[styles.carouselContainer, animatedHeaderStyle]}>
          <Carousel
            data={imgsPreview}
            onSnapToItem={handleIndexChanged}
            renderItem={renderCarousel}
            width={180}
            height={280}
            style={styles.carousel}
            pagingEnabled
            snapEnabled
            modeConfig={CAROUSEL_CONFIG}
            enabled={currentSlide != undefined}
            mode="horizontal-stack"
          />
        </Animated.View>
        <Animated.View style={headerBlurStyles}>
          <BlurView
            blurType="light"
            blurAmount={10}
            reducedTransparencyFallbackColor="white"
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
        <Animated.View style={styles.rowHeader}>
          <Text style={styles.logoText}>{t("common.app_name")}</Text>
          <Icon name="search-outline" size={30} color="white" />
        </Animated.View>
      </View>
    </>
  );
};

export default Home;

const styles = StyleSheet.create({
  background: {
    position: "absolute",
    width: height,
    height,
    top: "-10%",
    left: "-35%",
    borderRadius: height,
  },
  container: {
    paddingTop: StatusBar.currentHeight,
    paddingBottom: 5,
    ...Platform.select({
      web: {
        width: "100%",
        height,
        overflow: "visible",
      },
      default: {
        flex: 1,
      },
    }),
  },
  rowHeader: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width,
    paddingTop: Platform.select({
      web: 10,
    }),
    paddingBottom: 10,
    paddingHorizontal: 30,
    height: FIX_HEADER_HEIGHT,
    overflow: "hidden",
    zIndex: 2,
  },
  logoText: {
    color: "white",
    fontSize: 20,
  },
  carouselContainer: {
    marginBottom: 0,
    height: CAROUSEL_HEIGHT,
    width: "100%",
    position: "absolute",
    top: FIX_HEADER_HEIGHT,
    paddingTop: 10,
  },
  booksSectionText: {
    fontSize: 18,
    color: "white",
    marginBottom: 25,
  },
  separator: {
    marginBottom: 10,
  },
  carousel: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  headerBackground: {
    width,
    overflow: "hidden",
    position: "absolute",
  },
  headerBackgroundWeb: {
    left: 0,
    width,
    top: 0,
    height: FIX_HEADER_HEIGHT,
    position: "absolute",
    zIndex: -1,
  },
});
