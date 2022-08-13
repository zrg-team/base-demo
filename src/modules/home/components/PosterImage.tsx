import React, {memo, useCallback, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  View,
  Dimensions,
} from 'react-native';
import Animated, { LightSpeedInRight, SlideInUp } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import ImageColors from 'react-native-image-colors';
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SharedElement } from 'react-navigation-shared-element';

const { width: windowsWidth } = Dimensions.get('window');

interface Props {
  bookId: string
  index: number
  width?: number;
  height?: number;
  uri: string;
  animated?: boolean;
  animationName?: string;
  bottomRadius?: number;
  showPlayButton?: boolean;
  sharedAnimationPrefix?: string;
  buttonPlayPosition?: 'right' | 'center';
  borderTop?: boolean;
  onPress?: (id: string, animationType: string) => void;
  onFoundColor?: (index: number, colors: string[]) => void;
}
const PosterImage = memo(({
  uri,
  index,
  bookId,
  onPress,
  onFoundColor,
  width = 150,
  height = 234,
  animationName,
  showPlayButton,
  buttonPlayPosition = 'right',
  borderTop = true,
  animated = true,
  sharedAnimationPrefix,
}: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [colors, setColors] = useState<string[]>(['red', 'blue']);

  const getColorsAsync = useCallback(async () => {
    const result = await ImageColors.getColors(uri);
    switch (result.platform) {
      case 'ios':
        setColors([result.primary, result.secondary]);
        onFoundColor && onFoundColor(index, [result.primary, result.secondary])
        break
      case 'android':
        const vibrant = result.vibrant!;
        const dominant = result.dominant!;
        setColors([vibrant, dominant, result.average!]);
        onFoundColor && onFoundColor(index, [vibrant, dominant])
        break;
      default:
        throw new Error('Unexpected platform key');
    }
    setIsLoading(false);
  }, [showPlayButton, setIsLoading]);

  const imageStyles = useMemo(() => {
    return [
      {
        width,
        height: height - 20,
        ...styles.img,
      },
      !borderTop ? styles.noBorderTop : styles.img,
    ];
  }, [borderTop, height, width]);
  const gradientStyles = useMemo(() => {
    return [
      buttonPlayPosition === 'right' ? styles.right : styles.center,
      { width: width * 0.2, height: width * 0.2 },
      styles.playBtnContainer,
    ];
  }, [buttonPlayPosition, width, ]);
  const containerStyles = useMemo(() => {
    return [{ width, height }, styles.container];
  }, [width, height]);
  const source = useMemo(() => {
    return { uri }
  }, [uri]);

  const image = useMemo(() => (
    <Image
      resizeMode={'cover'}
      style={imageStyles}
      source={source}
      onLoadEnd={getColorsAsync}
    />
  ), [buttonPlayPosition, imageStyles, source, getColorsAsync])
  const imageWraper = useMemo(() => {
    if (sharedAnimationPrefix) {
      return (
        <SharedElement id={`book.${bookId}.photo.${sharedAnimationPrefix}`}>
          {image}
        </SharedElement>
      );
    }
    return image;
  }, [image, bookId, sharedAnimationPrefix])
  const enteringAnimation = useMemo(() => {
    if (animated) {
      switch (animationName) {
        case 'SlideInUp':
          return SlideInUp.delay(index * 320).duration(1400)
        default:
          return LightSpeedInRight.delay(index * 320).duration(800)
      }
    }
  }, [])

  return (
    <Animated.View
      entering={enteringAnimation}
      style={containerStyles}
    >
      {isLoading && (
        <View style={styles.loader}>
          <ActivityIndicator size={50} />
        </View>
      )}
      <TouchableOpacity onPress={() => onPress && onPress(bookId, sharedAnimationPrefix || '')} activeOpacity={0.9}>
        {imageWraper}
      </TouchableOpacity>
      {showPlayButton && !isLoading ? (
        <View
          style={gradientStyles}>
          <LinearGradient colors={colors} style={styles.linearGradient}>
            <Icon name="play" size={32} color="white" />
          </LinearGradient>
        </View>
      ) : null}
    </Animated.View>
  );
});

export default PosterImage;

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  img: {
    borderRadius: 15,
  },
  noBorderTop: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  playBtnContainer: {
    position: 'absolute',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  right: {
    bottom: 25,
    right: 10,
  },
  center: {
    bottom: 0,
    left: windowsWidth * 0.4,
  },
  linearGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});
