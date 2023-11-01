import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Tabs from "./Tabs";
import Stack from "./Stacks";

const Nav = createNativeStackNavigator();

const Root = () => (
  //두 개의 Navigator를 같이 사용할 때 screenOptions - headerShown: false 설정.

  // 한 screen에서 다른 Navigator 내에 있는 screen에 접근할 경우, (navigation.navigate())
  // 첫번째 arg로 Navigator 이름을 먼저 써주고,
  // 두번째 arg로 {screen: screen명} 을 써준다.
  <Nav.Navigator screenOptions={{ headerShown: false }}>
    <Nav.Screen name="Tabs" component={Tabs} />
    <Nav.Screen name="Stack" component={Stack} />
  </Nav.Navigator>
);

export default Root;
