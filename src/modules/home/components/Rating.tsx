import React from "react";
import { useTheme } from "native-base";
import { StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

interface Props {
  averageRating: number;
  ratingPeople: number;
}

const Rating = ({ averageRating, ratingPeople }: Props) => {
  const { colors: themeColors } = useTheme();
  return (
    <View style={styles.row}>
      <Icon name="star" size={16} color={themeColors.star} />
      <Text style={styles.ratingAvarageText}>{averageRating}</Text>
      <Text style={styles.ratingPoepleText}>({ratingPeople})</Text>
    </View>
  );
};

export default Rating;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingAvarageText: {
    fontSize: 16,
    color: "white",
    marginHorizontal: 5,
  },
  ratingPoepleText: {
    fontSize: 14,
    color: "#B7B6BC",
  },
});
