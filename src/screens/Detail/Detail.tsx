import React from 'react';
import { useTheme } from 'native-base';
import { StyleSheet, Text, View, Dimensions, FlatList } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import Animated, {
  withTiming,
  interpolate,
  withSequence,
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import PosterImage from '@modules/home/components/PosterImage';
import BookDetails from '@modules/home/components/BookDetails';
import { useBook } from '@modules/home/hooks/useBook';
import { bookAlsoLike } from '@constants/mocks';

const { width, height } = Dimensions.get('window');


type RouteParams = RouteProp<{ detail: { bookId: string, animationType: string } }, 'detail'>
const ReadingBook = () => {
  const { colors: themeColors } = useTheme();
  const translationY = useSharedValue(0);
  const route = useRoute<RouteParams>()
  const book = useBook(route?.params?.bookId);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    translationY.value = event.contentOffset.y;
  });

  const animationImageStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(translationY.value, [-100, 0, 100], [1.2, 1, 1.1], 'clamp'),
        },
        {
          translateY: interpolate(translationY.value, [-100, 0, 100], [-50, 0, -10], 'clamp'),
        },
      ],
    };
  });

  return (
    <Animated.ScrollView
      style={[styles.container, { backgroundColor: themeColors.defaultBackground }]}
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
          sharedAnimationPrefix={route?.params?.animationType || 'poster'}
        />
      </Animated.View>
      <View style={styles.contentContainer}>
        <BookDetails book={book} />
        <View style={styles.progresBar}>
          <View style={[styles.currentProgress, { backgroundColor: themeColors.secondary }]}>
            <View style={[styles.currentPosition, { backgroundColor: themeColors.secondary }]} />
          </View>
        </View>
        <View style={styles.rowProgress}>
          <Text style={styles.progressStart}>00:00</Text>
          <Text style={[styles.progressStart, styles.progressEnd]}>32:15</Text>
        </View>
      </View>
      <Text style={styles.couldLikeText}>You can also like</Text>
      <View style={styles.listContainer}>
        <FlatList
          data={bookAlsoLike}
          renderItem={({ item }) => (
            <PosterImage
              uri={item.poster}
              showPlayButton={false}
              width={70}
              height={110}
              bookId={item.id}
              index={0}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </Animated.ScrollView>
  );
};

export default ReadingBook;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 30,
  },
  progresBar: {
    width: '100%',
    height: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
  },
  currentProgress: {
    borderRadius: 30,
    position: 'absolute',
    top: 0,
    left: 0,
    height: 5,
    width: '70%',
  },
  currentPosition: {
    borderRadius: 30,
    position: 'absolute',
    top: '-50%',
    left: '97%',
    height: 10,
    width: 10,
    alignSelf: 'center',
  },
  rowProgress: { flexDirection: 'row', marginTop: 8 },
  progressStart: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  progressEnd: {
    position: 'absolute',
    left: '65%',
  },
  couldLikeText: {
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontSize: 14,
    marginLeft: 30,
    marginTop: 40,
    marginBottom: 20,
  },
  listContainer: {marginLeft: 30},
  separator: {marginRight: 10},
});
