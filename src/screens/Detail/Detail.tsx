import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "native-base";
import { StyleSheet, Text, View, Dimensions, Platform } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { RouteProp, useRoute } from "@react-navigation/native";
import Animated, {
  interpolate,
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
} from "react-native-reanimated";
import PosterImage from "@modules/home/components/PosterImage";
import BookDetails from "@modules/home/components/BookDetails";
import { useBook } from "@modules/home/hooks/useBook";
import { Book, bookAlsoLike } from "@constants/mocks";

const { width, height } = Dimensions.get("window");

type RouteParams = RouteProp<
  { Detail: { bookId: string; animationType: string } },
  "Detail"
>;
const ReadingBook = () => {
  const { colors: themeColors } = useTheme();
  const translationY = useSharedValue(0);
  const route = useRoute<RouteParams>();
  const book = useBook(route?.params?.bookId);
  const { t } = useTranslation();

  const scrollHandler = useAnimatedScrollHandler((event) => {
    translationY.value = event.contentOffset.y;
  });

  const keyExtractor = useCallback(
    (item: Book, index: number) => `${item.id}_${index}`,
    []
  );
  const renderRecommendBook = useCallback(
    ({ item }: { item: Book }) => (
      <PosterImage
        uri={item.poster}
        showPlayButton={false}
        width={70}
        height={110}
        bookId={item.id}
        animated={false}
        index={0}
      />
    ),
    []
  );
  const renderSeparator = useCallback(
    () => <View style={styles.separator} />,
    []
  );

  const animationImageStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(
            translationY.value,
            [-100, 0, 100],
            [1.2, 1, 1.1],
            "clamp"
          ),
        },
        {
          translateY: interpolate(
            translationY.value,
            [-100, 0, 100],
            [-50, 0, -10],
            "clamp"
          ),
        },
      ],
    };
  });

  const containerStyles = useMemo(() => {
    return [
      styles.container,
      { backgroundColor: themeColors.defaultBackground },
    ];
  }, [themeColors.defaultBackground]);

  return (
    <Animated.ScrollView
      style={containerStyles}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
    >
      <Animated.View style={animationImageStyle}>
        <PosterImage
          bookId={book.id}
          index={0}
          uri={book.poster}
          borderTop={false}
          animated={false}
          buttonPlayPosition="center"
          showPlayButton
          width={width}
          height={height * 0.67}
          sharedAnimationPrefix={route?.params?.animationType || "poster"}
        />
      </Animated.View>
      <View style={styles.contentContainer}>
        <BookDetails book={book} />
        <View style={styles.progresBar}>
          <View
            style={[
              styles.currentProgress,
              { backgroundColor: themeColors.secondary },
            ]}
          >
            <View
              style={[
                styles.currentPosition,
                { backgroundColor: themeColors.secondary },
              ]}
            />
          </View>
        </View>
        <View style={styles.rowProgress}>
          <Text style={styles.progressStart}>00:00</Text>
          <Text style={[styles.progressStart, styles.progressEnd]}>32:15</Text>
        </View>
      </View>
      <Text style={styles.couldLikeText}>{t("book_detail.also_like")}</Text>
      <View style={styles.listContainer}>
        <FlashList
          data={bookAlsoLike}
          renderItem={renderRecommendBook}
          keyExtractor={keyExtractor}
          ItemSeparatorComponent={renderSeparator}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </Animated.ScrollView>
  );
};

export default ReadingBook;

const styles = StyleSheet.create({
  container: Platform.select({
    default: {
      flex: 1,
    },
    web: {
      height,
    },
  }),
  contentContainer: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 30,
  },
  progresBar: {
    width: "100%",
    height: 5,
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
  },
  currentProgress: {
    borderRadius: 30,
    position: "absolute",
    top: 0,
    left: 0,
    height: 5,
    width: "70%",
  },
  currentPosition: {
    borderRadius: 30,
    position: "absolute",
    top: "-50%",
    left: "97%",
    height: 10,
    width: 10,
    alignSelf: "center",
  },
  rowProgress: { flexDirection: "row", marginTop: 8 },
  progressStart: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  progressEnd: {
    position: "absolute",
    left: "65%",
  },
  couldLikeText: {
    fontWeight: "bold",
    color: "#FFFFFF",
    fontSize: 14,
    marginLeft: 30,
    marginTop: 40,
    marginBottom: 20,
  },
  listContainer: { marginLeft: 30 },
  separator: { marginRight: 10 },
});
