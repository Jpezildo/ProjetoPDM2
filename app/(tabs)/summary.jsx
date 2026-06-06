import { useContext, useMemo } from "react";
import { MoneyContext } from "../../contexts/GlobalState";
import { categories } from "../../constants/categories";
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

    const safeTransactions = transactions || [];

    for (let i = 0; i < safeTransactions.length; i++) {
      const item = safeTransactions[i];
      
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

  // CORREÇÃO: Mudamos globalStyles.positiveText para styles.positiveText
  const valueStyle =
    totals.sum > 0 ? styles.positiveText : styles.negativeText;

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
    backgroundColor: colors?.background || '#F5F5F5',
    backgroundGradientFrom: colors?.background || '#F5F5F5',
    backgroundGradientTo: colors?.background || '#F5F5F5',
    decimalPlaces: 0, 
    color: (opacity = 1) => `rgba(55, 191, 129, ${opacity})`, 
    labelColor: (opacity = 1) => colors?.primaryText || '#000',
    barPercentage: 0.7, 
  };

  return (
    // CORREÇÃO: Mudamos globalStyles.screenContainer para styles.screenContainer
    <ScrollView style={styles.screenContainer}>
      <View style={styles.content}>
        
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

        {/* CORREÇÃO: Mudamos globalStyles.line para styles.line */}
        <View style={styles.line} />

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

// CORREÇÃO: Todos os estilos em falta foram trazidos para aqui!
const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: colors?.background || '#F5F5F5' },
  content: { flex: 1, padding: 20 },
  positiveText: { fontSize: 18, fontWeight: 'bold', color: '#34C759' },
  negativeText: { fontSize: 18, fontWeight: 'bold', color: '#FF3B30' },
  line: { height: 1, backgroundColor: colors?.secondaryText || '#C6C6C8', opacity: 0.3, marginVertical: 20 },
  balance: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40, 
  },
  balanceText: {
    fontSize: 18,
    color: colors?.primaryText || '#000',
    fontWeight: "800",
  },
  chartContainer: {
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  }
});