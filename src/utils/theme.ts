import { extendTheme } from 'native-base';

export const theme = extendTheme({
  colors: {
    defaultBackground: '#100B20',
    raitingPersons: '#87858F',
    secondary: '#FF9671',
    star: '#FF9671',
    tabFocus: '#FFFFFF',
    tabUnfocus: '#C7CBCE'
  },
  sizes: {
    tabbar: 68,
  }
});

// 2. Get the type of the CustomTheme
type CustomThemeType = typeof theme;

// 3. Extend the internal NativeBase Theme
declare module 'native-base' {
  interface ICustomTheme extends CustomThemeType {}
}
