import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Book } from '@constants/mocks';
import Rating from '@modules/home/components/Rating';

interface Props {
  book: Book;
  center?: boolean;
}
const BookDetails = ({ book, center = false }: Props) => {
  return (
    <View style={[styles.contentContainer, center && styles.center]}>
      <Text
        numberOfLines={2}
        adjustsFontSizeToFit
        style={[styles.title, center && styles.textCenter]}>
        {book.title}
      </Text>
      <Text style={styles.authorText}>{book.author}</Text>
      <View style={styles.ratingContainer}>
        <Rating
          averageRating={book.averageRating}
          ratingPeople={book.ratingPeople}
        />
      </View>
    </View>
  );
};

export default BookDetails;

const styles = StyleSheet.create({
  contentContainer: {
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    lineHeight: 30,
    color: 'white',
    marginBottom: 15,
  },
  textCenter: {
    paddingHorizontal: 30,
    textAlign: 'center',
  },
  authorText: {
    fontSize: 18,
    color: '#B7B6BC',
  },
  ratingContainer: {
    marginTop: 20,
    marginBottom: 35,
  },
});
