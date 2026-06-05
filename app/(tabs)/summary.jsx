import { useContext, useMemo } from "react";
import { MoneyContext } from "../../contexts/GlobalState";
import { categories } from "../../constants/categories";
import { globalStyles } from "../../styles/globalStyles";
import SummaryItem from "../../components/SummaryItem";
import MonthFilter from "../../components/MonthFilter";
import { StyleSheet, Text, View, ScrollView, Dimensions } from "react-native"; 
import { colors } from "../../constants/colors";
import { BarChart } from "react-native-chart-kit"; 

const SUMMARY_CATEGORY_KEYS = [
  categories.income.name,
  categories.food.name,
  categories.house.name,
  categories.education.name,
  categories.travel.name,
];

const screenWidth = Dimensions.get("window").width;

export default function Summary() {
  const [transactions, , filterDate] = useContext(MoneyContext);

  const getTotals = () => {
    const totals = {
      sum: 0,
      income: 0,
      food: 0,
      education: 0,
      house: 0,
      travel: 0,
    };

    for (let i = 0; i < transactions.length; i++) {
      const item = transactions[i];
      
      const transactionDate = new Date(item.date);
      const isSameMonth = transactionDate.getMonth() === filterDate.getMonth();
      const isSameYear = transactionDate.getFullYear() === filterDate.getFullYear();

      if (!SUMMARY_CATEGORY_KEYS.includes(item.category) || !isSameMonth || !isSameYear) {
        continue;
      }

      totals[item.category] += item.value;

      if (item.category === categories.income.name) {
        totals.sum += item.value;
      } else {
        totals.sum -= item.value;
      }
    }
    return totals;
  };

  const totals = useMemo(getTotals, [transactions, filterDate]);

  const valueStyle =
    totals.sum > 0 ? globalStyles.positiveText : globalStyles.negativeText;

  const chartData = {
    labels: [
      categories.income.displayName.substring(0, 3), 
      categories.food.displayName.substring(0, 3),   
      categories.house.displayName.substring(0, 3),  
      categories.education.displayName.substring(0, 3), 
      categories.travel.displayName.substring(0, 3), 
    ],
    datasets: [
      {
        data: [
          totals[categories.income.name],
          totals[categories.food.name],
          totals[categories.house.name],
          totals[categories.education.name],
          totals[categories.travel.name],
        ]
      }
    ]
  };

  const chartConfig = {
    backgroundColor: colors.background,
    backgroundGradientFrom: colors.background,
    backgroundGradientTo: colors.background,
    decimalPlaces: 0, 
    color: (opacity = 1) => `rgba(55, 191, 129, ${opacity})`, 
    labelColor: (opacity = 1) => colors.primaryText,
    barPercentage: 0.7, 
  };

  return (
    <ScrollView style={globalStyles.screenContainer}>
      <View style={globalStyles.content}>
        
        <MonthFilter />

        <View style={styles.chartContainer}>
          <BarChart
            data={chartData}
            width={screenWidth - 40} 
            height={220}
            yAxisLabel="R$ "
            chartConfig={chartConfig}
            verticalLabelRotation={0}
            fromZero={true} 
            style={{ borderRadius: 8 }}
          />
        </View>

        <SummaryItem
          category={categories.income.name}
          value={totals[categories.income.name]}
        />
        <SummaryItem
          category={categories.food.name}
          value={totals[categories.food.name]}
        />
        <SummaryItem
          category={categories.house.name}
          value={totals[categories.house.name]}
        />
        <SummaryItem
          category={categories.education.name}
          value={totals[categories.education.name]}
        />
        <SummaryItem
          category={categories.travel.name}
          value={totals[categories.travel.name]}
        />

        <View style={globalStyles.line} />

        <View style={styles.balance}>
          <Text style={styles.balanceText}>Saldo</Text>
          <Text style={valueStyle}>
            {totals.sum.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  balance: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40, 
  },
  balanceText: {
    fontSize: 18,
    color: colors.primaryText,
    fontWeight: "800",
  },
  chartContainer: {
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  }
});