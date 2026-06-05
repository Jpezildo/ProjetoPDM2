import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { globalStyles } from "../styles/globalStyles";
import CategoryItem from "./CategoryItem";
import { categories } from "../constants/categories";

export default function TransactionItem({
  id,
  category,
  date,
  description,
  value,
  onLongPress 
}) {
  const valueStyle =
    category === categories.income.name
      ? globalStyles.positiveText
      : globalStyles.negativeText;

  return (
    <TouchableOpacity 
      activeOpacity={0.7} 
      onLongPress={() => onLongPress({ id, description, value, category, date })} 
    >
      <View style={styles.itemContainer}>
        <CategoryItem category={category} />
        <View style={styles.textContainer}>
          <Text style={globalStyles.secondaryText}>
            {new Date(date).toLocaleDateString("pt-BR")}
          </Text>
          <View style={styles.bottomLineContainer}>
            <Text style={globalStyles.primaryText}>{description}</Text>
            <Text style={valueStyle}>
              {value.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </Text>
          </View>
        </View>
      </View>
      <View style={globalStyles.line} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 4,
  },
  textContainer: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    marginLeft: 12,
    paddingVertical: 8,
  },
  bottomLineContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});