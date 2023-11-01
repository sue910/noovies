import React, { useRef, useState } from "react";
import {
  PanResponder,
  View,
  ActivityIndicator,
  Animated,
  Image,
} from "react-native";
import { useAssets } from "expo-asset";
import { FontAwesome5 } from "@expo/vector-icons";
import styled from "styled-components/native";
import { useQuery } from "react-query";
import { getCoins } from "../fetchers";
import colors from "../colors";

const Container = styled.View`
  flex: 1;
  background-color: #1e272e;
  padding: 0 10px;
`;
const CardContainer = styled.View`
  flex: 3;
  justify-content: center;
  align-items: center;
`;
const Card = styled(Animated.createAnimatedComponent(View))`
  position: absolute;
  background-color: ${colors.accent};
  width: 280px;
  height: 360px;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.3);
`;
const CoinIcon = styled.Image`
  width: 160px;
  height: 160px;
  border-radius: 80px;
`;
const CoinName = styled.Text`
  margin-top: 12px;
  font-size: 32px;
  font-weight: 600;
  color: white;
`;
const BtnContainer = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: center;
  padding-top: 20px;
`;
const Btn = styled.TouchableOpacity`
  margin: 0 20px;
`;

export default function Discover() {
  const { data, refetch, isLoading } = useQuery("coins", getCoins);
  const cleanedList = data
    ?.filter((coin) => coin.rank !== 0)
    .filter((coin) => coin.is_active === true)
    .slice(0, 100);

  const position = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const secondScale = position.interpolate({
    inputRange: [-300, 0, 300],
    outputRange: [1, 0.7, 1],
    extrapolate: "clamp",
  });
  const rotatinon = position.interpolate({
    inputRange: [-250, 250],
    outputRange: ["-15deg", "15deg"],
    extrapolate: "clamp",
    //값이 inputRange를 벗어났을 경우 처리하는 옵션(clamp: 기존값 내에서 멈춤)
  });

  const onPressIn = () =>
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();

  const onPressOut = Animated.spring(scale, {
    toValue: 1,
    useNativeDriver: true,
  });
  const goCenter = Animated.spring(position, {
    toValue: 0,
    useNativeDriver: true,
  });
  const goLeft = Animated.spring(position, {
    toValue: -500,
    tension: 5,
    restSpeedThreshold: 100,
    restDisplacementThreshold: 100,
    useNativeDriver: true,
  });
  const goRight = Animated.spring(position, {
    toValue: 500,
    tension: 5,
    restSpeedThreshold: 100,
    restDisplacementThreshold: 100,
    useNativeDriver: true,
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => onPressIn(),
      onPanResponderRelease: (_, { dx }) => {
        if (dx < -220) {
          goLeft.start(onDismiss);
        } else if (dx > 220) {
          goRight.start(onDismiss);
        } else {
          Animated.parallel([onPressOut, goCenter]).start();
        }
      },
      onPanResponderMove: (_, { dx }) => {
        position.setValue(dx);
      },
    })
  ).current;

  const [index, setIndex] = useState(0);
  const onDismiss = () => {
    position.setValue(0);
    scale.setValue(1);
    setIndex((prev) => prev + 1);
  };
  const pressClose = () => {
    goLeft.start(onDismiss);
  };
  const pressCheck = () => {
    goRight.start(onDismiss);
  };

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#1e272e",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  return (
    <Container>
      <CardContainer>
        <Card style={{ transform: [{ scale: secondScale }] }}>
          <CoinIcon
            source={{
              uri: `https://coinicons-api.vercel.app/api/icon/${cleanedList[
                index + 1
              ].symbol.toLowerCase()}`,
            }}
          />
          <CoinName>{cleanedList[index + 1].name}</CoinName>
        </Card>
        <Card
          {...panResponder.panHandlers}
          style={{
            transform: [
              { scale },
              { translateX: position },
              { rotateZ: rotatinon },
            ],
          }}
        >
          <CoinIcon
            source={{
              uri: `https://coinicons-api.vercel.app/api/icon/${cleanedList[
                index
              ].symbol.toLowerCase()}`,
            }}
          />
          <CoinName>{cleanedList[index].name}</CoinName>
        </Card>
      </CardContainer>

      <BtnContainer>
        <Btn onPress={pressClose} activeOpacity={0.8}>
          <FontAwesome5 name="frown" color="white" size={50} />
        </Btn>
        <Btn onPress={pressCheck} activeOpacity={0.8}>
          <FontAwesome5 name="grin-hearts" color="white" size={50} />
        </Btn>
      </BtnContainer>
    </Container>
  );
}
