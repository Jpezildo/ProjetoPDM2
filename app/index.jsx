import { Redirect } from "expo-router";
import { useContext } from "react";
import { MoneyContext } from "../contexts/GlobalState";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { colors } from "../constants/colors";

export default function Index() {
  const [userName, , isReady] = useContext(MoneyContext);

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!userName) {
    return <Redirect href="/welcome" />;
  }

  return <Redirect href="/(tabs)" />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  }
});