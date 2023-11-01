import React, { useCallback, useEffect, useState } from "react";
import { Text, View, Image, useColorScheme } from "react-native";
import { Asset, useAssets } from "expo-asset";
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { useFonts } from "expo-font";
import Tabs from "./navigation/Tabs";
import Stack from "./navigation/Stacks";
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";
import { ThemeProvider } from "styled-components/native";
import Root from "./navigation/Root";
import { darkTheme, lightTheme } from "./styledTheme";

// fetch가 끝날 때까지 splash screen을 표시한다.(hideAsync가 실행되기 전까지)
SplashScreen.preventAutoHideAsync();

export default function App() {
  const isDark = useColorScheme() === "dark";
  const [appIsReady, setAppIsReady] = useState(false);
  //return Boolean (폰트 로드 여부 출력)
  const [isFontsLoaded, fontsLoadError] = useFonts({
    ...Entypo.font,
    ...Ionicons.font,
  });
  //return [] (로드한 asset 목록 출력 / 에러 또는 로딩중일 시 undefined)
  const [assets, assetsError] = useAssets([
    require("./gosim.jpg"),
    require("./jg.jpg"),
  ]);

  // useEffect(() => {
  //   async function prepare() {
  //     try {
  //       // 이곳에서 폰트 pre-load 또는 API 호출을 한다
  //       // [hook 사용 안하는 버전 - api호출 또는 로드 중 할 작업이 많은 경우]
  //       //Font 단수형 ex - loadAsync(Ionicons.font);
  //       await Font.loadAsync({...Entypo.font, ...Ionicons.font});
  //       //Asset 단수형 ex - loadAsync(require('./gosim.jpg'));
  //       await Asset.loadAsync([require('./gosim.jpg'), require('./jg.jpg')]);
  //       //외부 이미지 로드
  //       await Image.prefetch('https://img.sbs.co.kr/newimg/news/20231011/201843206_1280.jpg');
  //       // 인위적인 딜레이 (2초)
  //       await new Promise(resolve => setTimeout(resolve, 2000));
  //     } catch (e) {
  //       console.warn(e);
  //     } finally {
  //       // 렌더 실행(hideAsync 실행 트리거)
  //       setAppIsReady(true);
  //     }
  //   }
  //   prepare();
  // }, []);

  const onLayoutRootView = useCallback(async () => {
    if (isFontsLoaded && assets) {
      /**
       * 즉시 splash screen을 숨긴다.
       * 만약 setState 다음에 바로 실행되면 initial state를 로드할(최초 렌더링)때
       * 빈 화면이 뜰 가능성이 있으므로 root view가 일단 표시된 후에
       * splash screen을 숨기도록 한다.
       */
      await SplashScreen.hideAsync();
    }
  }, [isFontsLoaded, assets]);

  if (!isFontsLoaded || !assets) {
    return null;
  }

  return (
    //App.js에서 useColorScheme과 theme object를 사용하여 앱 전체 테마를 바꿀수 있다.
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <NavigationContainer
        // onReady = onLayout(View일 경우 splash screen 숨기는 props)
        // https://reactnavigation.org/docs/navigation-container/#onready
        onReady={onLayoutRootView}
        //다크모드 쉽게 설정하기(기본 테마값)
        //theme={isDark ? DarkTheme : DefaultTheme}
      >
        <Root />
      </NavigationContainer>
    </ThemeProvider>
  );
}
