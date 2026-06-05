import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useContext } from "react";
import { MoneyContext } from "../contexts/GlobalState";
import { colors } from "../constants/colors";

export default function MonthFilter() {
  const [,, filterDate, setFilterDate] = useContext(MoneyContext);

  const changeMonth = (modifier) => {
    const newDate = new Date(filterDate);
    newDate.setMonth(newDate.getMonth() + modifier);
    setFilterDate(newDate);
  };

  const monthName = filterDate.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.button}>
        <MaterialIcons name="chevron-left" size={28} color={colors.primaryContrast} />
      </TouchableOpacity>

      <Text style={styles.dateText}>
        {monthName.charAt(0).toUpperCase() + monthName.slice(1)}
      </Text>

      <TouchableOpacity onPress={() => changeMonth(1)} style={styles.button}>
        <MaterialIcons name="chevron-right" size={28} color={colors.primaryContrast} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  button: {
    padding: 4,
  },
  dateText: {
    color: colors.primaryContrast,
    fontSize: 18,
    fontWeight: "bold",
  }
});