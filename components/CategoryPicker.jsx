import { Picker } from "@react-native-picker/picker"
import { StyleSheet, Text, View } from "react-native"
import { globalStyles } from "../styles/globalStyles"
import { colors } from "../constants/colors"
import { useContext } from "react"
import { MoneyContext } from "../contexts/GlobalState"

export default function CategoryPicker({ form, setForm }) {
  const [categories] = useContext(MoneyContext);

  const categoriesList = Object.values(categories);

  return (
    <View>
      <Text style={globalStyles.inputLabel}>Categoria</Text>
      <View style={styles.picker}>
        <Picker
          selectedValue={form.category}
          onValueChange={(itemValue) => setForm({ ...form, category: itemValue })}
        >
          {categoriesList.map((cat) => (
            <Picker.Item 
              key={cat.id} 
              label={cat.displayName} 
              value={cat.id} 
            />
          ))}
        </Picker>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  picker: {
    display: "flex",
    justifyContent: "center",
    height: 44,
    borderColor: colors.secondaryText,
    borderWidth: 1,
    borderRadius: 8,
    flexGrow: 1
  }
})