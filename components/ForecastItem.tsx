import { StyleSheet, Text, View } from "react-native";
import { WeatherForecast } from "@/app";
import dayjs from "dayjs";

const ForecastItem = ({ forecast }: { forecast: WeatherForecast }) => {
  return (
    <View>
      <Text style={styles.temp}>{Math.round(forecast.main.temp)}</Text>
      <Text style={styles.date}>
        {dayjs(forecast.dt * 1000).format("ddd ha")}
      </Text>
    </View>
  );
};

export default ForecastItem;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    aspectRatio: 9 / 16,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",

    borderWidth: StyleSheet.hairlineWidth,
  },
  temp: {
    fontSize: 35,
    color: "red",
    marginVertical: 10,
  },
  date: {
    color: "blue",
    fontSize: 16,
  },
});
