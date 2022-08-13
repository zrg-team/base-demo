import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FlipInXDown } from 'react-native-reanimated';
import { Book } from '@constants/mocks';
import PosterImage from '@modules/home/components/PosterImage';
import Rating from '@modules/home/components/Rating';

interface Props {
  index: number;
  book: Book;
  onPress?: (id: string, animationType: string) => void;
}
const BookCard = ({ book, onPress = () => {}, index }: Props) => {
  return (
    <Animated.View entering={FlipInXDown.delay(index * 200)} style={styles.container}>
      <PosterImage
        index={0}
        bookId={book.id}
        uri={book.poster}
        showPlayButton={false}
        width={80}
        height={110}
        animated={false}
        onPress={() => onPress && onPress(book.id, 'book')}
        sharedAnimationPrefix='book'
      />

      <View style={styles.bookDetail}>
        <Text numberOfLines={3} adjustsFontSizeToFit style={styles.bookTitle}>
          {book.title}
        </Text>
        <Text style={styles.authorText}>{book.author}</Text>
        <View style={styles.rowPrice}>
          <Text style={styles.priceText}>{book.price} €</Text>
          <View style={styles.spacing} />
          <Rating
            averageRating={book.averageRating}
            ratingPeople={book.ratingPeople}
          />
        </View>
      </View>
    </Animated.View>
  );
};

export default BookCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: 300,
  },
  bookDetail: {
    marginLeft: 30,
    flex: 1,
    paddingVertical: 6,
  },
  bookTitle: {
    fontSize: 18,
    color: 'white',
    width: '100%',
  },
  authorText: {
    fontSize: 12,
    marginVertical: 5,
    color: '#B7B6BC'
  },
  rowPrice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  spacing: {
    flex: 1,
  },
  priceText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  ratingAvarageText: {
    fontSize: 14,
    color: 'white',
    marginHorizontal: 5,
  },
  ratingPoepleText: {
    fontSize: 13,
  },
});
