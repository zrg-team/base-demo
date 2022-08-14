import "react-native-gesture-handler";
import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { LogBox, StatusBar } from "react-native";
import { RecoilRoot } from "recoil";
import { enableScreens } from "react-native-screens";
import { NativeBaseProvider } from "native-base";
import { I18nextProvider } from "react-i18next";
import { I18n } from "@i18n/index";
import AppNavigator from "@navigation/index";
import { theme } from "@utils/theme";
import { useAppInitial } from "@hooks/app";

dayjs.extend(relativeTime);
enableScreens();

LogBox.ignoreAllLogs();

const App = (): JSX.Element => {
  const initial = useAppInitial();
  return (
    <RecoilRoot>
      <NativeBaseProvider theme={theme}>
        <I18nextProvider i18n={I18n}>
          <StatusBar translucent backgroundColor="transparent" />
          <AppNavigator onLoaded={initial} />
        </I18nextProvider>
      </NativeBaseProvider>
    </RecoilRoot>
  );
};
export default App;
