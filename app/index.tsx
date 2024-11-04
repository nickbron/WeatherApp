import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

import * as Location from "expo-location";
import ForecastItem from "@/components/ForecastItem";
import { Stack } from "expo-router";

const OPEN_WEATHER_KEY = process.env.EXPO_PUBLIC_OPEN_WEATHER_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";
const bgImage = "../assets/images/background-img.jpg";

type MainWeather = {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level: number;
  grnd_level: number;
};

type Weather = {
  name: string;
  main: MainWeather;
  weather: [
    {
      id: string;
      main: string;
      description: string;
      icon: string;
    }
  ];
};
export type WeatherForecast = {
  main: MainWeather;
  dt: number;
};

export default function Index() {
  const [weather, setWeather] = useState<Weather>();
  const [forecast, setForecast] = useState<WeatherForecast[]>();
  const [location, setLocation] = useState<Location.LocationObject>();
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (location) {
      fetchWeather();
      fetchForecast();
    }
  }, [location]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const fetchWeather = async () => {
    if (!location) {
      return;
    }

    const result = await fetch(
      `${BASE_URL}/weather?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=${OPEN_WEATHER_KEY}&units=metric`
    );
    const data = await result.json();
    // console.log("data", JSON.stringify(data, null, 2));
    setWeather(data);
  };

  const fetchForecast = async () => {
    if (!location) {
      return;
    }

    const result = await fetch(
      `${BASE_URL}/forecast?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=${OPEN_WEATHER_KEY}&units=metric`
    );
    const data = await result.json();
    // console.log(JSON.stringify(data, null, 2));
    setForecast(data.list);
  };

  if (!weather) {
    return <ActivityIndicator />;
  }

  return (
    <ImageBackground
      source={{ uri: bgImage }}
      resizeMode="cover"
      style={styles.container}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={styles.location}>{weather.name}</Text>
        <Text style={styles.temp}>{Math.round(weather.main.temp)}℃</Text>
      </View>
      <FlatList
        data={forecast}
        horizontal
        style={{
          flexGrow: 0,
          height: 200,
          marginBottom: 40,
        }}
        contentContainerStyle={{
          gap: 10,
          paddingHorizontal: 10,
        }}
        renderItem={({ item }) => <ForecastItem forecast={item} />}
      />
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "white",
    alignItems: "center",
  },
  location: {
    fontSize: 30,
    color: "lightgray",
  },
  temp: {
    fontSize: 100,
    color: "gray",
  },
});
