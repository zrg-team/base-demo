import React, { FunctionComponent, useState } from "react";
import { Alert, Center, VStack, HStack, Box, Text } from "native-base";
import { Dimensions, Platform } from "react-native";
import { useTranslation } from "react-i18next";
import { WEB_VERSION_MAX_WIDTH } from "@constants/index";

const { width: windowWidth } = Dimensions.get("window");

const WebWrapper: FunctionComponent<{ children: JSX.Element }> = ({
  children,
}) => {
  const [width, setWidth] = useState(windowWidth);
  const { t } = useTranslation();

  if (Platform.OS !== "web" || width <= WEB_VERSION_MAX_WIDTH) {
    return children;
  }
  return (
    <Center>
      <Alert
        marginTop="30%"
        w="90%"
        maxW="400"
        status="error"
        colorScheme="error"
      >
        <VStack space={2} flexShrink={1} w="100%">
          <HStack
            flexShrink={1}
            space={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <HStack flexShrink={1} space={2} alignItems="center">
              <Alert.Icon />
              <Text fontSize="md" fontWeight="medium" color="coolGray.800">
                {t("errors.web_window_size.title")}
              </Text>
            </HStack>
          </HStack>
          <Box pl="6">{t("errors.web_window_size.description")}</Box>
        </VStack>
      </Alert>
    </Center>
  );
};

export default WebWrapper;
