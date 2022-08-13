import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

type WelcomePageProps = {};
function WelcomePage(_props: WelcomePageProps): JSX.Element {
  const navigation = useNavigation();
  return (
    <View style={{ backgroundColor: 'red', flex: 1 }}>
      <Text>{'Get things done with DO Pro'}</Text>
      <Text>
        {
          'Do pro is a smart personal assistant that helps millions of people all over the world to boost their productivity'
        }
      </Text>
      <Icon name="rocket" size={30} color="#FFFFFF" />
      <TouchableOpacity onPress={() => navigation.navigate('Detail' as never)}>
        <Text>Navigate</Text>
      </TouchableOpacity>
    </View>
  );
}
export default WelcomePage;
