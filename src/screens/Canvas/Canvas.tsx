import React, { useRef } from 'react';
import { View, Image, Dimensions } from 'react-native';
import { SharedElement } from 'react-navigation-shared-element';

const { width, height } = Dimensions.get('window');

type CanvasPageProps = {};
function CanvasPage(_props: CanvasPageProps): JSX.Element {
  return (
    <View style={{ flex: 1 }}>
      <SharedElement id={`item.1.photo`}>
        <Image
          style={{ width, height, position: 'absolute' }}
          source={{ uri: 'https://qph.cf2.quoracdn.net/main-qimg-57077525030f9b877265ae24634ad2f2-lq' }}
        />
      </SharedElement>
    </View>
  );
}
export default CanvasPage;
