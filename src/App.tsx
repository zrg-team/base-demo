import 'react-native-gesture-handler';
import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { LogBox, ActivityIndicator } from 'react-native';
import { enableScreens } from 'react-native-screens';
import { store, persistor } from '@store/index';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { NativeBaseProvider } from "native-base";
import { I18nextProvider } from 'react-i18next';
import { I18n } from '@i18n/index';
import AppNavigator from '@navigation/index';
import { theme } from '@utils/theme';

dayjs.extend(relativeTime);
enableScreens();

LogBox.ignoreAllLogs();

const App = (): JSX.Element => {
  return (
    <Provider store={store}>
      <PersistGate loading={<ActivityIndicator />} persistor={persistor}>
        <NativeBaseProvider theme={theme}>
          <I18nextProvider i18n={I18n}>
            <AppNavigator />
          </I18nextProvider>
        </NativeBaseProvider>
      </PersistGate>
    </Provider>
  );
};
export default App;
