import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { StatusBar, StyleSheet, Text, View, Dimensions } from "react-native";
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
import { BlurView } from "@shared/react-native-community/blur";
import { BookImg, imgsPreview, booksList, Book } from "@constants/mocks";
import PosterImage from "@modules/home/components/PosterImage";
import BookCard from "@modules/home/components/BookCard";
import { useTranslation } from "react-i18next";

const { width, height } = Dimensions.get("screen");

const CAROUSEL_HEIGHT = 290;
const FIX_HEADER_HEIGHT = 60;

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);
const AnimatedList = Animated.createAnimatedComponent(FlashList);

const Home = () => {
  const animationTimeoutRef = useRef<undefined | any>();
  const backgroundAnimation = useSharedValue(0);
  const [animationColors, setAnimationColors] = useState<
    string[] | undefined
  >();
  const colorsRef = useRef<Record<string, string[]>>({});
  const [currentSlide, setCurrentSlide] = useState<number | undefined>();
  const translationY = useSharedValue(-CAROUSEL_HEIGHT);
  const navigation = useNavigation();
  const { colors: themeColors, sizes } = useTheme();
  const { t } = useTranslation();

  useEffect(() => {
    return () => {
      clearTimeout(animationTimeoutRef.current);
    };
  }, []);

  const handleSetColors = useCallback((index: number, colors: string[]) => {
    colorsRef.current[index] = colors;
    if (currentSlide === undefined && index === 0) {
      setCurrentSlide(0);
      setAnimationColors(colors);
      backgroundAnimation.value = withTiming(1, { duration: 1200 });
    }
  }, []);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    translationY.value = event.contentOffset.y;
  });

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
    animationTimeoutRef.current = setTimeout(() => {
      setAnimationColors(colors);
    }, 600);
    backgroundAnimation.value = withSequence(
      withTiming(0, { duration: 600 }),
      withTiming(1, { duration: 800 })
    );
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
      paddingTop: CAROUSEL_HEIGHT + FIX_HEADER_HEIGHT,
    };
  }, []);

  return (
    <>
      <Animated.View style={behindBackgroundStyle} />
      {animationColors ? (
        <AnimatedGradient
          colors={animationColors}
          style={[styles.background, animatedBackgroundStyle]}
        />
      ) : null}
      <View style={styles.container}>
        <AnimatedList
          contentContainerStyle={listContentStyle}
          data={booksList}
          keyExtractor={keyExtractor}
          renderItem={renderBook}
          onScroll={scrollHandler}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
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
            modeConfig={{
              snapDirection: "left",
              stackInterval: 18,
            }}
            enabled={currentSlide != undefined}
            mode="horizontal-stack"
          />
        </Animated.View>
        <Animated.View style={styles.rowHeader}>
          <AnimatedBlurView
            blurType="light"
            blurAmount={10}
            reducedTransparencyFallbackColor="white"
            style={[styles.headerBackground, animatedBackgroundHeaderStyle]}
          />
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
    left: "-20%",
    borderRadius: height,
  },
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    paddingBottom: 5,
  },
  rowHeader: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width,
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 30,
    height: FIX_HEADER_HEIGHT,
    overflow: "hidden",
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
    marginBottom: 20,
  },
  carousel: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  headerBackground: {
    width,
    height: FIX_HEADER_HEIGHT,
    position: "absolute",
  },
});
