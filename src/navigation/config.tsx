import { StackCardInterpolationProps } from "@react-navigation/stack"
import { Animated, Platform } from "react-native"

export const slideAnimation = ({
  current,
  next,
  inverted,
  layouts: { screen }
}: StackCardInterpolationProps) => {
  const progress = Animated.add(
    current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolate: 'clamp'
    }),
    next
      ? next.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
          extrapolate: 'clamp'
        })
      : 0
  )

  return {
    cardStyle: {
      transform: [
        {
          translateX: Animated.multiply(
            progress.interpolate({
              inputRange: [0, 1, 2],
              outputRange: [screen.width, 0, screen.width * -0.3],
              extrapolate: 'clamp'
            }),
            inverted
          )
        }
      ]
    }
  }
}

export default Platform.select({
  web: {
    animationEnabled: true,
    cardStyleInterpolator: slideAnimation
  },
  default: {},
})